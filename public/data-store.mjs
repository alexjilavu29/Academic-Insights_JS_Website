const SERVER = 'http://localhost:8080'

class DataStore {
  constructor () {
    this.data = []
    this.data2 = []
  }

  async getAll () {
    const response = await fetch(`${SERVER}/score`)
    if (!response.ok) {
      throw response
    } else {
      this.data = await response.json()
    }
  }

  async getAllAttendants() {
    const response = await fetch(`${SERVER}/AttendantsRecord/score`);
    if (!response.ok) {
      throw response;
    } else {
      this.data2 = await response.json();
    }
  }


  async addOne (item) {
    const response = await fetch(`${SERVER}/score`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    if (!response.ok) {
      throw response
    } else {
      await this.getAll()
    }
  }

  async addOneAttendant (item) {
    const response = await fetch(`${SERVER}/AttendantsRecord/score`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    if (!response.ok) {
      throw response
    } else {
      await this.getAllAttendants()
    }
  }


  async deleteOne (id) {
    const response = await fetch(`${SERVER}/score/${id}`, {
      method: 'delete'
    })
    if (!response.ok) {
      throw response
    }
    await this.getAll()
  }

  async saveOne (id, item) {
    const response = await fetch(`${SERVER}/score/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    if (!response.ok) {
      throw response
    } else {
      await this.getAll()
    }
  }

}
const store = new DataStore()

export default {
  store
}
