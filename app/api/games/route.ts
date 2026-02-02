// API endpoint for games list with search and filters
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const country = searchParams.get('country') || 'all'
    const gameType = searchParams.get('gameType') || 'all'
    const sortBy = searchParams.get('sortBy') || 'newest'

    const skip = (page - 1) * limit

    // Build where clause based on user role
    let whereClause: any = {}
    
    if (user.role === 'admin') {
      whereClause = {}
    } else if (user.role === 'reviewer') {
      whereClause = {
        OR: [
          { reviewStatus: 'published' },
          { reviewStatus: 'under_review' }
        ]
      }
    } else if (user.role === 'editor') {
      whereClause = {
        OR: [
          { contributorId: user.id },
          { reviewStatus: 'published' }
        ]
      }
    } else {
      whereClause = { reviewStatus: 'published' }
    }

    // Add search filter
    if (search) {
      whereClause.OR = [
        { canonicalName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { localNames: { hasSome: [search] } },
        { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } }
      ]
    }

    // Add status filter
    if (status !== 'all') {
      whereClause.reviewStatus = status
    }

    // Add country filter
    if (country !== 'all') {
      whereClause.countryId = country
    }

    // Add game type filter
    if (gameType !== 'all') {
      whereClause.gameType = { contains: gameType, mode: 'insensitive' }
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'name':
        orderBy = { canonicalName: 'asc' }
        break
      case 'name_desc':
        orderBy = { canonicalName: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Fetch total count
    const total = await db.game.count({ where: whereClause })
    const totalPages = Math.ceil(total / limit)

    // Fetch games
    const games = await db.game.findMany({
      where: whereClause,
      include: {
        country: true,
        heritageField: true,
        tags: { include: { tag: true } },
        contributor: {
          select: { name: true }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Get stats
    const statsWhereClause = user.role === 'admin' ? {} : 
      user.role === 'reviewer' ? { OR: [{ reviewStatus: 'published' }, { reviewStatus: 'under_review' }] } :
      user.role === 'editor' ? { OR: [{ contributorId: user.id }, { reviewStatus: 'published' }] } :
      { reviewStatus: 'published' }

    const stats = {
      total: await db.game.count({ where: statsWhereClause }),
      published: await db.game.count({ where: { ...statsWhereClause, reviewStatus: 'published' } }),
      underReview: await db.game.count({ where: { ...statsWhereClause, reviewStatus: 'under_review' } }),
      draft: await db.game.count({ where: { ...statsWhereClause, reviewStatus: 'draft' } })
    }

    // Get countries for filter
    const countries = await db.country.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })

    // Get game types for filter
    const gameTypesResult = await db.game.findMany({
      where: statsWhereClause,
      select: { gameType: true },
      distinct: ['gameType']
    })
    const gameTypes = gameTypesResult
      .map(g => g.gameType)
      .filter(Boolean)
      .sort()

    return NextResponse.json({
      games,
      total,
      totalPages,
      currentPage: page,
      stats,
      countries,
      gameTypes,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
