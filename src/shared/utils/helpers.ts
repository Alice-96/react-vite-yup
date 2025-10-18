// 簡単なユーティリティ関数
export const sum = (a: number, b: number): number => {
  return a + b
}

export const formatUserName = (firstName: string, lastName: string): string => {
  return `${lastName} ${firstName}`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatAge = (age: number | null): string => {
  if (age === null || age === undefined) {
    return '未入力'
  }
  return `${age}歳`
}