<h2>Cảm ơn bạn đã đặt hàng tại FitMe!</h2>

<p><strong>Mã đơn hàng:</strong> {{ $order->orders_code }}</p>
<p><strong>Địa chỉ nhận:</strong> {{ $order->receiving_address }}</p>
<p><strong>SĐT:</strong> {{ $order->recipient_phone }}</p>

<h4>Chi tiết sản phẩm:</h4>
<ul>
@foreach($orderDetails as $item)
    <li>
        {{ $item['name_product'] }} - {{ $item['quantity'] }} x {{ number_format($item['price']) }}đ
        @if($item['color']) (Màu: {{ $item['color'] }}) @endif
        @if($item['size']) (Size: {{ $item['size'] }}) @endif
    </li>
@endforeach
</ul>

<p><strong>Tổng thanh toán:</strong> {{ number_format($order->total_amount) }}đ</p>
<p>Cảm ơn bạn đã tin tưởng mua sắm tại FitMe!</p>
