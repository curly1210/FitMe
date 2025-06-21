<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thông báo đơn hàng mới</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 700px;
            background: #fff;
            margin: auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .header h2 {
            color: #0d6efd;
        }
        .info, .items {
            margin-top: 20px;
        }
        .info p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        .footer {
            text-align: center;
            font-size: 13px;
            margin-top: 30px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Đơn hàng mới từ {{ $order->recipient_name }}</h2>
            <p>Mã đơn hàng: <strong>{{ $order->orders_code }}</strong></p>
        </div>

        <div class="info">
            <p><strong>Người nhận:</strong> {{ $order->recipient_name }}</p>
            <p><strong>SĐT:</strong> {{ $order->recipient_phone }}</p>
            <p><strong>Địa chỉ:</strong> {{ $order->receiving_address }}</p>
            <p><strong>Phương thức thanh toán:</strong> {{ $order->payment_method }}</p>
        </div>

        <div class="items">
            <h4>Chi tiết sản phẩm:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Màu</th>
                        <th>Size</th>
                        <th>SL</th>
                        <th>Giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($orderDetails as $item)
                        <tr>
                            <td>{{ $item['name_product'] }}</td>
                            <td>{{ $item['color'] }}</td>
                            <td>{{ $item['size'] }}</td>
                            <td>{{ $item['quantity'] }}</td>
                            <td>{{ number_format($item['sale_price']) }}₫</td>
                            <td>{{ number_format($item['subtotal']) }}₫</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="info">
            <p><strong>Tổng tiền sản phẩm:</strong> {{ number_format($order->total_price_item) }}₫</p>
            <p><strong>Phí vận chuyển:</strong> {{ number_format($order->shipping_price) }}₫</p>
            <p><strong>Giảm giá:</strong> {{ number_format($order->discount) }}₫</p>
            <p><strong>Tổng thanh toán:</strong> <strong>{{ number_format($order->total_amount) }}₫</strong></p>
        </div>

        <div class="footer">
            Đây là email tự động. Vui lòng không trả lời email này.
        </div>
    </div>
</body>
</html>
