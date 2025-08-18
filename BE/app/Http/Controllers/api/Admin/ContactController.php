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
    public function index()
    {
        $contacts = Contact::all();
        return $contacts;
        
    }

    public function show($id)
    {
        $contact = Contact::find($id);

        if(!$contact){
            return $this->error('Không tìm thấy liên hệ',[],404);
        }

        $contact->update(['is_read' => true ]);

        return $contact;
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

         if(!$contact){
            return $this->error('Không tìm thấy liên hệ',[],404);
        }

         if(!$contact->is_read){
            return $this->error('Chỉ xóa khi đã xem liên hệ',[],403);
        }
        $contact->delete();

        return $this->success(null, 'Xóa liên hệ thành công');
    }
}
