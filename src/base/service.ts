/**
 * CRUD 服务基类
 */
export class BaseService {
  constructor(protected readonly repository) {}

  /**
   * 根据条件查询列表
   * @param query 查询条件
   */
  async list(query) {
    let page = parseInt(query._page || 1, 10);
    let pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page
    delete query._pageSize

    let order = {};
    if (query._order) {
      let tmp = query._order.split('_');
      order[tmp[0]] = tmp[1].toUpperCase();
      delete query._order;
    } else {
      order = { id: 'ASC'};
    }

    let result = await this.repository.findAndCount({
      where: query,
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: order,
    });
    
    return {
      list: result[0],
      count: result[1],
      page: page,
      pageSize: pageSize,
    }
  }

  /**
   * 获取单个对象
   * @param id 
   */
  async detail(id) {
    let result = await this.repository.findOne(id) || [];
    // 无数据时为空数组
    if (result.length === 0) {
      return {};
    }
    return result;
  }

  /** 
   * 创建对象
   * @param data 
   */
  async create(data) {
    let result = await this.repository.save(data);
    return result;
  }

  /**
   * 更新对象
   * @param id 
   * @param data 
   */
  async update(id, data) {
    let toUpdate = await this.repository.findOne(id);
    Object.assign(toUpdate, data);

    let result = await this.repository.save(toUpdate);
    return result;
  }

  /**
   * 删除对象
   * @param id 
   */
  async remove(id) {
    let toRemove = await this.repository.findOne(id);
    let result = await this.repository.remove(toRemove);
    return result;
  }
}
