
class Item {
  constructor(data) {
    this.item = data;
    this.quantity = Number(data.quantity);
    this._id = data._id;
  }
}

class Customer {
  constructor(data) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.address = date.address;
    this.zipcode = data.zipcode;
    this.city = data.city;
  }
}

module.exports = class Cart {
  constructor(oldcart) {
    this.items = oldcart.items || {};
    this.customer = oldcart.customer || {};
    this.times = oldcart.times || {};
  }

  itemsToArray() {
    let array = [];
    for(let item in this.items) {
        array.push(this.items[item]);
    }
    return array;
  }

  addItem(item) {
    let existingItem = this.items[data._id];
    if(existingItem) {
      this.removeItem(data._id);
    } else {
      existingItem = this.items[data._id] = new Item(data);
    }
    return this;
  }

  removeItem(id) {
    delete this.items[id];
    return this;
  }

  addCustomer(data) {
    let customer = new Customer(data);
    this.customer = customer;
    return this;
  }

  total_duration() {
    let durations = this.items.map((item) => item.duration);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return durations.reduce(reducer);
  }

  getTotalPrice() {

  }

  getTotalQuanity() {

  }
}