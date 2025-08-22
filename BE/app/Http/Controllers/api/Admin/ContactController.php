<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    //
    use ApiResponse;
    // public function index()
    // {
    //     $contacts = Contact::all();
    //     return $contacts;
    // }
    public function index(Request $request)
    {
        $query = Contact::query();

        // Lọc theo trạng thái is_read
        if ($request->has('is_read')) {
            $isRead = filter_var($request->input('is_read'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($isRead)) {
                $query->where('is_read', $isRead);
            }
        }

        // Lọc theo tên
        if ($request->has('name') && $request->input('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        // Lọc theo email
        if ($request->has('email') && $request->input('email')) {
            $query->where('email', 'like', '%' . $request->input('email') . '%');
        }

        // Lọc theo số điện thoại
        if ($request->has('phone') && $request->input('phone')) {
            $query->where('phone', 'like', '%' . $request->input('phone') . '%');
        }

        $contacts = $query->get();
        return $contacts;
    }

    public function show($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return $this->error('Không tìm thấy liên hệ', [], 404);
        }

        return $contact;
    }

    public function update($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return $this->error('Không tìm thấy liên hệ', [], 404);
        }

        $contact->update(['is_read' => 1]);

        return response()->json([
            'message' => 'Đã xử lí liên hệ',
            'data' => $contact
        ], 200);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return $this->error('Không tìm thấy liên hệ', [], 404);
        }

        if (!$contact->is_read) {
            return $this->error('Chỉ xóa khi đã xem liên hệ', [], 403);
        }
        $contact->delete();

        return $this->success(null, 'Xóa liên hệ thành công');
    }
}
