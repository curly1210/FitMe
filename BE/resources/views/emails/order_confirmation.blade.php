<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đơn hàng từ FitMe</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50;">Cảm ơn bạn đã đặt hàng tại <span style="color: #e67e22;">FitMe</span>!</h2>

        <p><strong>Mã đơn hàng:</strong> {{ $order->orders_code }}</p>
        <p><strong>Địa chỉ nhận:</strong> {{ $order->receiving_address }}</p>
        <p><strong>SĐT:</strong> {{ $order->recipient_phone }}</p>

        <h3 style="margin-top: 30px;">🛒 Chi tiết đơn hàng</h3>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="text-align: left; padding: 8px;">Sản phẩm</th>
                    <th style="text-align: center; padding: 8px;">Số lượng</th>
                    <th style="text-align: right; padding: 8px;">Đơn giá</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orderDetails as $item)
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px;">
                            {{ $item['name_product'] }}
                            @if($item['color'])<br><small>Màu: {{ $item['color'] }}</small>@endif
                            @if($item['size'])<br><small>Size: {{ $item['size'] }}</small>@endif
                        </td>
                        <td style="text-align: center; padding: 8px;">{{ $item['quantity'] }}</td>
                        <td style="text-align: right; padding: 8px;">{{ number_format($item['sale_price']) }}đ</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p style="margin-top: 30px; font-size: 16px;">
            <strong>Tổng thanh toán:</strong> 
            <span style="color: #e74c3c;">{{ number_format($order->total_amount) }}đ</span>
        </p>

        <p style="margin-top: 20px;">Cảm ơn bạn đã tin tưởng mua sắm tại <strong>FitMe</strong>. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn trong thời gian sớm nhất.</p>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">

        <p style="font-size: 14px; color: #777;">
            👤 <strong>Chủ doanh nghiệp:</strong> Cường Curly<br>
            📧 <strong>Email hỗ trợ:</strong> <a href="mailto:giaabaoo0510@gmail.com">giaabaoo0510@gmail.com</a>
        </p>

        <p style="font-size: 13px; color: #aaa; margin-top: 30px;">Bạn nhận được email này vì đã đặt hàng tại FitMe. Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi.</p>
    </div>
</body>
</html>
