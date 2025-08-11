<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $direct_link
 * @property string $url_image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\BannerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereDirectLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Banner whereUrlImage($value)
 */
	class Banner extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $quantity
 * @property int $user_id
 * @property int $product_item_id
 * @property int $is_choose
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ProductItem $productItem
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CartItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereIsChoose($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereProductItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CartItem whereUserId($value)
 */
	class CartItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property int|null $parent_id
 * @property string $image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * @method static \Database\Factories\CategoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereUpdatedAt($value)
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductImage> $productImages
 * @property-read int|null $product_images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductItem> $productItems
 * @property-read int|null $product_items_count
 * @method static \Database\Factories\ColorFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Color withoutTrashed()
 */
	class Color extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $content
 * @property int $user_id
 * @property int $product_id
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CommentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereUserId($value)
 */
	class Comment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string $content
 * @property string $title
 * @property bool $is_read
 * @property \Illuminate\Support\Carbon $created_at
 * @method static \Database\Factories\ContactFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contact whereTitle($value)
 */
	class Contact extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $value
 * @property \Illuminate\Support\Carbon $time_start
 * @property \Illuminate\Support\Carbon|null $time_end
 * @property int $min_price_order
 * @property int|null $max_price_discount
 * @property int $limit_use
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property string $type
 * @method static \Database\Factories\CouponFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereLimitUse($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereMaxPriceDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereMinPriceOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereTimeEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereTimeStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Coupon withoutTrashed()
 */
	class Coupon extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $orders_code
 * @property int $total_price_item
 * @property int $shipping_price
 * @property int $discount
 * @property int $total_amount
 * @property int $status_payment
 * @property string $payment_method
 * @property string $receiving_address
 * @property string $recipient_name
 * @property string $recipient_phone
 * @property int $status_order_id
 * @property int $user_id
 * @property string|null $bank_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $success_at
 * @property string|null $transaction_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrdersDetail> $orderDetails
 * @property-read int|null $order_details_count
 * @property-read \App\Models\StatusOrder $statusOrder
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\OrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereBankCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereOrdersCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereReceivingAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereRecipientName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereRecipientPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereShippingPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereStatusOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereStatusPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereSuccessAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereTotalPriceItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereTransactionAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Order whereUserId($value)
 */
	class Order extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $quantity
 * @property int $price
 * @property int $sale_price
 * @property int $sale_percent
 * @property string $image_product
 * @property string $color
 * @property string $size
 * @property string $name_product
 * @property int|null $product_item_id
 * @property int $order_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\ProductItem|null $productItem
 * @property-read \App\Models\Review|null $review
 * @method static \Database\Factories\OrdersDetailFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereImageProduct($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereNameProduct($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereProductItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereSalePercent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereSalePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OrdersDetail whereUpdatedAt($value)
 */
	class OrdersDetail extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property int $used
 * @property string|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereUsed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordReset whereUserId($value)
 */
	class PasswordReset extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property string $thumbnail
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\PostFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereThumbnail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Post whereUpdatedAt($value)
 */
	class Post extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property int $total_inventory
 * @property string $short_description
 * @property string $description
 * @property string $slug
 * @property int $category_id
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Category $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductImage> $productImages
 * @property-read int|null $product_images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductItem> $productItems
 * @property-read int|null $product_items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Wishlist> $wishlists
 * @property-read int|null $wishlists_count
 * @method static \Database\Factories\ProductFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereShortDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereTotalInventory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product withoutTrashed()
 */
	class Product extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $url
 * @property int $product_id
 * @property int $color_id
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Color $color
 * @property-read \App\Models\Product $product
 * @method static \Database\Factories\ProductImageFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereColorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductImage whereUrl($value)
 */
	class ProductImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $product_id
 * @property int $price
 * @property int|null $sale_price
 * @property int|null $sale_percent
 * @property int $stock
 * @property string $sku
 * @property int $is_active
 * @property int $color_id
 * @property int $size_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CartItem> $cartItems
 * @property-read int|null $cart_items_count
 * @property-read \App\Models\Color $color
 * @property-read \App\Models\ProductImage|null $imageByColor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrdersDetail> $ordersDetail
 * @property-read int|null $orders_detail_count
 * @property-read \App\Models\Product $product
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\Size $size
 * @method static \Database\Factories\ProductItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereColorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereSalePercent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereSalePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereSizeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereSku($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductItem withoutTrashed()
 */
	class ProductItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $rate
 * @property string $content
 * @property int $is_update
 * @property int $user_id
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property int|null $product_item_id
 * @property int $order_detail_id
 * @property-read \App\Models\OrdersDetail $orderDetail
 * @property-read \App\Models\ProductItem|null $productItem
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReviewImage> $reviewImages
 * @property-read int|null $review_images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReviewReply> $reviewReplies
 * @property-read int|null $review_replies_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ReviewFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereIsUpdate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereOrderDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereProductItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review withoutTrashed()
 */
	class Review extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $url
 * @property int $review_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Review $review
 * @method static \Database\Factories\ReviewImageFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage whereReviewId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewImage whereUrl($value)
 */
	class ReviewImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $content
 * @property int $review_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Review $review
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ReviewReplyFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereReviewId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReviewReply whereUserId($value)
 */
	class ReviewReply extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name_receive
 * @property string $phone
 * @property string $country
 * @property string $city
 * @property string $district
 * @property string $ward
 * @property string $detail_address
 * @property int $is_default
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Foundation\Auth\User $user
 * @method static \Database\Factories\ShippingAddressFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereDetailAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereDistrict($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereNameReceive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingAddress whereWard($value)
 */
	class ShippingAddress extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductItem> $productItems
 * @property-read int|null $product_items_count
 * @method static \Database\Factories\SizeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Size withoutTrashed()
 */
	class Size extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $color
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read int|null $orders_count
 * @method static \Database\Factories\StatusOrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusOrder whereUpdatedAt($value)
 */
	class StatusOrder extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $avatar
 * @property string|null $birthday
 * @property string $phone
 * @property string|null $gender
 * @property string $role
 * @property int $is_ban
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ShippingAddress> $addresses
 * @property-read int|null $addresses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CartItem> $cart_items
 * @property-read int|null $cart_items_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read int|null $orders_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReviewReply> $reviewReplies
 * @property-read int|null $review_replies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ShippingAddress> $shipping_address
 * @property-read int|null $shipping_address_count
 * @property-read \App\Models\Wallet|null $wallet
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsBan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Tymon\JWTAuth\Contracts\JWTSubject {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $bank_name
 * @property string $account_number
 * @property string $account_holder
 * @property int $balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletTransaction> $walletTransactions
 * @property-read int|null $wallet_transactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WithdrawRequest> $withdrawRequests
 * @property-read int|null $withdraw_requests_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereAccountHolder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereAccountNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereBankName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wallet whereUserId($value)
 */
	class Wallet extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $wallet_id
 * @property int $amount
 * @property string $type
 * @property string|null $bill_url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Wallet $wallet
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereBillUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WalletTransaction whereWalletId($value)
 */
	class WalletTransaction extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $product_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\WishlistFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Wishlist whereUserId($value)
 */
	class Wishlist extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $wallet_id
 * @property int $amount
 * @property string $status
 * @property string|null $reject_reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Wallet $wallet
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereRejectReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WithdrawRequest whereWalletId($value)
 */
	class WithdrawRequest extends \Eloquent {}
}

