import type { Conversation } from 'ant-design-x-vue'

/**
 * 打开数据库
 * @param {string} dbName 数据库的名字
 * @param {number} version 数据库的版本
 * @return {Promise<IDBDatabase>} 该函数会返回一个数据库实例
 */
export function openDB(dbName: string, version = 1): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const indexedDB = window.indexedDB
    let db
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version)
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      db = (event.target as IDBOpenDBRequest).result // 数据库对象
      console.log('数据库打开成功')
      resolve(db)
    }
    // 数据库打开失败的回调
    request.onerror = function () {
      console.log('数据库打开报错')
      reject('数据库打开失败')
    }
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      console.log('onupgradeneeded')
      db = (event.target as IDBOpenDBRequest).result // 数据库对象
      // 创建存储库 - 用于存储对话
      if (!db.objectStoreNames.contains('conversations')) {
        const objectStore = db.createObjectStore('conversations', {
          keyPath: 'id', // 这是主键
        })
        // 创建索引
        objectStore.createIndex('id', 'id', { unique: true })
      }
    }
  })
}

/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 * @return {Promise<boolean>} 返回写入是否成功
 */
export function addData(db: IDBDatabase, storeName: string, data: object) {
  return new Promise(resolve => {
    const request = db
      .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data)

    request.onsuccess = function () {
      console.log('数据写入成功')
      resolve(true)
    }

    request.onerror = function () {
      console.log('数据写入失败')
      resolve(false)
    }
  })
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
export function getDataByKey(db: IDBDatabase, storeName: string, key: string) {
  return new Promise(resolve => {
    const transaction = db.transaction([storeName]) // 事务
    const objectStore = transaction.objectStore(storeName) // 仓库对象
    const request = objectStore.get(key) // 通过主键获取数据

    request.onerror = function () {
      console.log('事务失败')
    }

    request.onsuccess = function () {
      console.log('主键查询结果: ', request.result)
      resolve(request.result)
    }
  })
}

/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @return {Promise<any[]>} 返回读取的数据列表
 */
export function cursorGetData(
  db: IDBDatabase,
  storeName: string,
): Promise<Conversation[]> {
  return new Promise(resolve => {
    const list: Conversation[] = []
    const store = db
      .transaction(storeName, 'readonly') // 事务
      .objectStore(storeName) // 仓库对象
    const request = store.openCursor() // 指针对象
    // 游标开启成功，逐行读数据
    request.onsuccess = function (e) {
      const cursor = (e.target as IDBRequest).result
      if (cursor) {
        // 必须要检查
        list.push(cursor.value)
        cursor.continue() // 遍历了存储对象中的所有内容
      } else {
        console.log('游标读取的数据：', list)
        resolve(list)
      }
    }

    request.onerror = function () {
      console.log('游标读取失败')
      resolve([])
    }
  })
}

/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function getDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: IDBKeyRange,
) {
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
  const request = store.index(indexName).get(indexValue)
  request.onerror = function () {
    console.log('事务失败')
  }
  request.onsuccess = function (event) {
    const result = (event.target as IDBOpenDBRequest).result
    console.log('索引查询结果：', result)
  }
}

/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function cursorGetDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
) {
  const list: Conversation[] = []
  const store = db.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
  const request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
  request.onsuccess = function (e) {
    const cursor = (e.target as IDBRequest | null)?.result
    if (cursor) {
      // 必须要检查
      list.push(cursor.value)
      cursor.continue() // 遍历了存储对象中的所有内容
    } else {
      console.log('游标索引查询结果：', list)
    }
  }
  request.onerror = function () {}
}

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 * @return {Promise<boolean>} 返回更新是否成功
 */
export function updateDB(
  db: IDBDatabase,
  storeName: string,
  data: Conversation,
) {
  return new Promise(resolve => {
    const request = db
      .transaction([storeName], 'readwrite') // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data)

    request.onsuccess = function () {
      console.log('数据更新成功')
      resolve(true)
    }

    request.onerror = function () {
      console.log('数据更新失败')
      resolve(false)
    }
  })
}

/**
 * 通过主键删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} id 主键值
 * @return {Promise<boolean>} 返回删除是否成功
 */
export function deleteDB(db: IDBDatabase, storeName: string, id: string) {
  return new Promise(resolve => {
    const request = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .delete(id)

    request.onsuccess = function () {
      console.log('数据删除成功')
      resolve(true)
    }

    request.onerror = function () {
      console.log('数据删除失败')
      resolve(false)
    }
  })
}

/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
export function closeDB(db: IDBDatabase) {
  db.close()
  console.log('数据库已关闭')
}

/**
 * 删除数据库
 * @param {object} dbName 数据库名称
 */
export function deleteDBAll(dbName: string) {
  console.log(dbName)
  const deleteRequest = window.indexedDB.deleteDatabase(dbName)
  deleteRequest.onerror = function () {
    console.log('删除失败')
  }
  deleteRequest.onsuccess = function () {
    console.log('删除成功')
  }
}
