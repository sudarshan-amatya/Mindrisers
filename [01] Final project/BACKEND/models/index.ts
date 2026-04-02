import User from './User'
import Product from './Product'
import Cart from './Cart'
import Order from './Order'
import OrderItem from './OrderItem'
import Wishlist from './Wishlist'
import CartItem from './CartItems'

User.hasOne(Cart, {
    foreignKey: 'userId',
    as: 'cart',
})

Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'items',
})

CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart',
})

Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems',
})

CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
})

User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders',
})

Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
})

OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
})

Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
})

OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
})

User.hasMany(OrderItem, {
    foreignKey: 'sellerId',
    as: 'sellerOrderItems',
})

OrderItem.belongsTo(User, {
    foreignKey: 'sellerId',
    as: 'seller',
})

User.hasMany(Wishlist, {
    foreignKey: 'userId',
    as: 'wishlists',
})

Wishlist.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

Product.hasMany(Wishlist, {
    foreignKey: 'productId',
    as: 'wishlists',
})

Wishlist.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
})

export {
    User,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Wishlist,
}