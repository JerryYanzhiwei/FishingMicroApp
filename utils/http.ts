// 封装 tt.request 为类似 axios 的接口
const http = {
  request(config: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }) {
    // 处理 GET 请求的参数拼接
    let requestUrl = 'https://www.finspot.cn/api' + config.url;

    if (config.method === 'GET' && config.params) {
      const params = this.buildQueryString(config.params);
      if (params) {
        requestUrl += (requestUrl.includes('?') ? '&' : '?') + params;
      }
    }

    return new Promise((resolve, reject) => {
      tt.request({
        url: requestUrl,
        method: config.method || 'GET',
        data: config.method === 'GET' ? undefined : config.data,
        header: config.headers,
        success: (res) => resolve(res.data),
        fail: (err) => reject(err),
      });
    });
  },

  // 手动构建查询字符串，兼容抖音小程序环境
  buildQueryString(params: any): string {
    if (!params) return '';

    const queryParts: string[] = [];

    for (const key in params) {
      if (
        params.hasOwnProperty(key) &&
        params[key] !== undefined &&
        params[key] !== null
      ) {
        // 对键和值进行URL编码
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(params[key]);
        queryParts.push(`${encodedKey}=${encodedValue}`);
      }
    }

    return queryParts.join('&');
  },

  get(
    url: string,
    config?: { params?: any; headers?: Record<string, string> }
  ) {
    return this.request({
      url,
      method: 'GET',
      params: config?.params,
      headers: config?.headers,
    });
  },

  post(url: string, data?: any, config?: { headers?: Record<string, string> }) {
    return this.request({
      url,
      method: 'POST',
      data,
      headers: config?.headers,
    });
  },
};

export default http;
