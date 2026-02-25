export interface ImClientVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 部门id
   */
  deptId: string | number;

  /**
   * 客户端名称
   */
  clientName: string;

  /**
   * 客户端端口
   */
  clientPort: string;

  /**
   * 客户端api url
   */
  clientApiUrl: string;

}

export interface ImClientForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 客户端名称
   */
  clientName?: string;

  /**
   * 客户端端口
   */
  clientPort?: string;

  /**
   * 客户端api url
   */
  clientApiUrl?: string;

  /**
   * 客户端s3 key
   */
  clientS3Key?: string;

  /**
   * 客户端s3 密钥
   */
  clientS3Secret?: string;

  /**
   * 客户端s3 桶
   */
  clientS3Bucket?: string;

}

export interface ImClientQuery extends PageQuery {

  /**
   * 客户端名称
   */
  clientName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
