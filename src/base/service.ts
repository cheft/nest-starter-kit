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
    const page = parseInt(query._page || 1, 10);
    const pageSize = parseInt(query._pageSize || 10, 10);
    delete query._page;
    delete query._pageSize;

    let order = {};
    if (query._order) {
      const tmp = query._order.split('_');
      order[tmp[0]] = tmp[1].toUpperCase();
      delete query._order;
    } else {
      order = { id: 'ASC' };
    }

    const result = await this.repository.findAndCount({
      order,
      where: query,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      page,
      pageSize,
      list: result[0],
      count: result[1],
    };
  }

  /**
   * 获取单个对象
   * @param id
   */
  async detail(id) {
    const result = await this.repository.findOne(id) || [];
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
    const result = await this.repository.save(data);
    return result;
  }

  /**
   * 更新对象
   * @param id
   * @param data
   */
  async update(id, data) {
    const toUpdate = await this.repository.findOne(id);
    Object.assign(toUpdate, data);

    const result = await this.repository.save(toUpdate);
    return result;
  }

  /**
   * 删除对象
   * @param id
   */
  async remove(id) {
    const toRemove = await this.repository.findOne(id);
    const result = await this.repository.remove(toRemove);
    return result;
  }
}
