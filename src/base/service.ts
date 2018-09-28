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
    return await this.repository.find();
  }

  /**
   * 获取单个对象
   * @param id 
   */
  async one(id) {
    return await this.repository.findOne(id);
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
