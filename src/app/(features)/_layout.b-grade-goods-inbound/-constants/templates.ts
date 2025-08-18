export const VietnameseDefectDescriptionTemplate = /* template */ `
   <h2 style="text-align:center">BIỂU MẪU MÔ TẢ LỖI NHẬP HÀNG LOẠI B</h2>
   
   <p style="line-height: 2"><strong>Nhà máy:</strong> ...</p>
   <p style="line-height: 2"><strong>Ngày nhập kho:</strong> ... /... /...</p>
   <p style="line-height: 2"><strong>Người lập phiếu:</strong> ...</p>
   <p style="line-height: 2"><strong>Bộ phận:</strong> ...</p>
   

   <h3>1. Loại lỗi phát hiện</h3>
   <ul data-type="taskList">
      <li data-type="taskItem" data-checked="false">Trầy xước bề mặt da/vải</li>
      <li data-type="taskItem" data-checked="false">Bong keo / hở keo</li>
      <li data-type="taskItem" data-checked="false">Sai màu / loang màu</li>
      <li data-type="taskItem" data-checked="false">Lỗi đường may (lệch, bung chỉ, dư chỉ)</li>
      <li data-type="taskItem" data-checked="false">Bẩn, dính vết bẩn không lau được</li>
      <li data-type="taskItem" data-checked="false">Lỗi form dáng (lệch phom, méo, không cân)</li>
      <li data-type="taskItem" data-checked="false">Lỗi đế (móp méo, nứt, sứt mẻ)</li>
      <li data-type="taskItem" data-checked="false">Khác: ...</li>
   </ul>

   <h3>2. Mô tả chi tiết lỗi</h3>
   <p>...</p>
   <p>...</p>
   <p>...</p>
   
   <h3>3. Hình ảnh minh họa</h3>
   <div className="tableWrapper">
      <table style="border-collapse:collapse; width:100%;">
         <tr>
            <td>
               <p id='image-placeholder' style="text-align:center;"> 
                  Chèn hình ảnh mô tả
               </p>
            </td>
         </tr>
      </table>
   </div>


   <h3>4. Xác nhận</h3>
   <div class="grid grid-cols-3 gap-x-3">
      <p>Người lập phiếu: ............................ (ký, ghi rõ họ tên)</p>
      <p>Quản lý kho: ................................ (ký, ghi rõ họ tên)</p>
      <p>QC/QA: ...................................... (ký, ghi rõ họ tên)</p>
   </div>
`
