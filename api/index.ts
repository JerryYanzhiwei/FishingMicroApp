import http from "../utils/http";

export const finSpotApi = {
  async getSpotList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    difficulty?: string
  }) {
    try {
      const result = await http.get('/finSpot/get-finSpot-list', { params })
      return result.data
    } catch (error) {
      console.error('获取钓点列表失败:', error)
      throw error
    }
  },

  async getSpotDetail(id: string) {
    try {
      const result = await http.get('/finSpot/get_finSpot_detail', { params: { id } })
      return result.data
    } catch (error) {
      console.error('获取钓点详情失败:', error)
      throw error
    }
  }
}