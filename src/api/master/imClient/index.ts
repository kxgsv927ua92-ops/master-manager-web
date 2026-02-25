import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ImClientVO, ImClientForm, ImClientQuery } from '@/api/master/imClient/types';

/**
 * 查询im平台客户端列表
 * @param query
 * @returns {*}
 */

export const listImClient = (query?: ImClientQuery): AxiosPromise<ImClientVO[]> => {
  return request({
    url: '/master/imClient/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询im平台客户端详细
 * @param id
 */
export const getImClient = (id: string | number): AxiosPromise<ImClientVO> => {
  return request({
    url: '/master/imClient/' + id,
    method: 'get'
  });
};

/**
 * 新增im平台客户端
 * @param data
 */
export const addImClient = (data: ImClientForm) => {
  return request({
    url: '/master/imClient',
    method: 'post',
    data: data
  });
};

/**
 * 修改im平台客户端
 * @param data
 */
export const updateImClient = (data: ImClientForm) => {
  return request({
    url: '/master/imClient',
    method: 'put',
    data: data
  });
};

/**
 * 删除im平台客户端
 * @param id
 */
export const delImClient = (id: string | number | Array<string | number>) => {
  return request({
    url: '/master/imClient/' + id,
    method: 'delete'
  });
};

/**
 * 获取客户端JSON配置
 * @param clientId
 */
export const getClientJson = (clientId: string | number): AxiosPromise<{ code: number; msg: string; data: null }> => {
  return request({
    url: '/master/imClient/getJson',
    method: 'get',
    params: { clientId }
  });
};

/**
 * 更新客户端URL配置
 * @param data
 */
export const updateAppUrl = (data: {
  clientId: string | number;
  urls?: string[];
  im?: string[];
  down?: string;
  trcId?: string;
  trcKey?: string;
  [key: string]: any;
}) => {
  return request({
    url: '/master/imClient/updateAppUrl',
    method: 'post',
    data: data
  });
};
