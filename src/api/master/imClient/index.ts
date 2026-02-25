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
