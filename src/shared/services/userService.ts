import { User, UserListResponse } from '../types'

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    name: '田中 太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    website: 'tanaka-portfolio.com',
    company: {
      name: '株式会社タナカ',
      catchPhrase: 'イノベーションを推進する',
      bs: 'synergize scalable supply-chains',
    },
    address: {
      street: '渋谷区神南1-2-3',
      suite: 'Suite 401',
      city: '東京',
      zipcode: '150-0041',
      geo: {
        lat: '35.6628',
        lng: '139.7016',
      },
    },
  },
  {
    id: 2,
    name: '佐藤 花子',
    email: 'sato@example.com',
    phone: '080-9876-5432',
    website: 'sato-design.jp',
    company: {
      name: 'サトウデザイン事務所',
      catchPhrase: 'クリエイティブな解決策を提供',
      bs: 'maximize intuitive applications',
    },
    address: {
      street: '新宿区西新宿2-1-1',
      suite: 'Floor 15',
      city: '東京',
      zipcode: '163-0806',
      geo: {
        lat: '35.6903',
        lng: '139.6917',
      },
    },
  },
  {
    id: 3,
    name: '山田 次郎',
    email: 'yamada@example.com',
    phone: '070-5555-1234',
    company: {
      name: 'ヤマダ・テクノロジーズ',
      catchPhrase: 'テクノロジーで未来を創る',
      bs: 'revolutionize cutting-edge technologies',
    },
    address: {
      street: '品川区大井1-47-1',
      suite: 'Building A',
      city: '東京',
      zipcode: '140-0014',
      geo: {
        lat: '35.6051',
        lng: '139.7345',
      },
    },
  },
  {
    id: 4,
    name: '鈴木 美咲',
    email: 'suzuki@example.com',
    phone: '090-7777-8888',
    website: 'suzuki-consulting.com',
    company: {
      name: 'スズキコンサルティング',
      catchPhrase: '戦略的ソリューションの提供',
      bs: 'optimize strategic methodologies',
    },
    address: {
      street: '港区六本木3-2-1',
      suite: 'Tower B 20F',
      city: '東京',
      zipcode: '106-0032',
      geo: {
        lat: '35.6627',
        lng: '139.7380',
      },
    },
  },
  {
    id: 5,
    name: '高橋 健一',
    email: 'takahashi@example.com',
    phone: '080-1111-2222',
    company: {
      name: 'タカハシ工業株式会社',
      catchPhrase: '品質と信頼性を追求',
      bs: 'enhance robust infrastructures',
    },
    address: {
      street: '千代田区丸の内1-1-1',
      suite: 'Office 500',
      city: '東京',
      zipcode: '100-0005',
      geo: {
        lat: '35.6812',
        lng: '139.7671',
      },
    },
  },
]

// Simulate API delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Mock API service functions
export const userService = {
  async fetchUsers(page = 1, limit = 10): Promise<UserListResponse> {
    // Simulate network delay
    await delay(500)

    // // Simulate occasional error for testing
    // if (Math.random() < 0.1) {
    //   throw new Error('Failed to fetch users')
    // }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = mockUsers.slice(startIndex, endIndex)

    return {
      users: paginatedUsers,
      total: mockUsers.length,
      page,
      limit,
    }
  },

  async fetchUser(id: number): Promise<User> {
    await delay(300)

    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      throw new Error(`User with id ${id} not found`)
    }

    return user
  },
}
