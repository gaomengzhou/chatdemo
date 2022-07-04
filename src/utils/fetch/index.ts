import axios from 'axios';

const fetch = axios.create({
  timeout: 1000 * 15,
});

/** 请求配置 */
export class Fetch {
  /** 响应拦截器 */
  public interceptors = [] as any;

  /** 参数配置 */
  protected options = {};

  /**
   * get 请求
   */
  public get(url: string, body?: any, config?: any) {
    let request: any | FormData;
    if (body instanceof FormData) {
      request = body;
    } else {
      request = {
        body: body || {},
        header: {
          apiName: url,
          callTime: Date.now(),
          sign: '',
          gzipEnabled: 0,
          deviceCode: '',
        },
      };
    }
    return this.sendCommon(request, { ...(config || {}), url, method: 'get' });
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param body 请求对象中请求体
   * @param config 请求配置, 等价于axios.config
   * @return 返回响应结果
   */
  public post(url: string, body?: any, config?: any) {
    let request: any | FormData;
    if (body instanceof FormData) {
      request = body;
    } else {
      request = {
        body: body || {},
        header: {
          apiName: url,
          callTime: Date.now(),
          sign: '',
          gzipEnabled: 0,
          deviceCode: '',
        },
      };
    }

    return this.sendCommon(request, { ...(config || {}), url, method: 'post' });
  }

  /**
   *
   * @param config axios配置
   * @param opts 配置
   */
  // eslint-disable-next-line no-unused-vars
  public async send(config: any, opts: { enableCrypto?: boolean } = {}) {
    const xhr = await fetch(config).then(
      (res) => res,
      (res) => res.response || res
    );
    // if (!xhr.data || typeof xhr.data !== "object") xhr.data = { code: xhr.status };
    try {
      if (!xhr.data.body || typeof xhr.data.body !== 'object') {
        throw new Error('Invalid response!');
      }
    } catch (error) {
      xhr.data = { body: { code: xhr.status } };
    }

    let res = xhr.data.body;
    res.header = xhr.data.header;
    if (typeof res.code !== 'number') {
      res.code = xhr.status;
    }
    res.success = xhr.status === 200 && +res.code === 1;
    if (!res.message) {
      if (xhr.status === 404) {
        res.message = '网络请求丢失!';
      } else if (xhr.status === 503) {
        res.message = '网络不给力，验证失败';
      } else if (xhr.status === 504) {
        res.message = '网络不给力，网关超时';
      } else if (xhr.status === 500) {
        res.message = '服务维护中';
      } else {
        res.message = res.success ? '操作成功!' : '操作失败!';
      }
    }

    // 执行拦截器
    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.interceptors) {
      // 没有消息不处理了
      if (!res.message) {
        break;
      }
      res = interceptor(res);
    }
    return Promise.resolve(res);
  }

  /**
   * 发送请求
   * @param request 请求对象
   * @param config 请求配置, 等价于axios.config
   * @return 返回响应结果
   */
  protected async sendCommon(
    request: any | FormData,
    config: any
  ): Promise<any> {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers = { ...config.headers };

    if (request instanceof FormData) {
      request.set('token', '');
      config.headers['content-type'] = 'multipart/form-data;';
      config.data = request;
    } else {
      config.headers['content-type'] = 'application/json;charset=UTF-8';
      config.headers.accept = '*/*';
      request.header.token = '';
      // 阻塞获取唯一密匙成功过后，继续执行
      config.data = request.body;
    }
    const res = await this.send(config);
    // 1006: 签名非法
    // 如果在加载页面之前，后台没有开启加密，后期开加密，自动切换加密
    // 如果已开加密还是报错，就不再处理
    if (!res.success && res.code === 1006) {
      if (config.headers.isEncryptEnabled) return res;
      return this.sendCommon(request, config);
    }
    return res;
  }
}
export default Fetch;
