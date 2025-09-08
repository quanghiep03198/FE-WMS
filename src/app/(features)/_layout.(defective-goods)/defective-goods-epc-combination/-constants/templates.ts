import { Languages } from '@/common/constants/enums'

export class DefectDescriptionTemplate {
	static readonly [Languages.VIETNAMESE] = /* template */ `
   
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
      <ul data-type="bulletList">
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
      </ul>
      
      <h3>3. Hình ảnh minh họa</h3>
      <p class="my-1"><span style="color: rgb(163, 163, 163);">(Chèn hình ảnh mô tả)</span></p>
   `

	static readonly [Languages.ENGLISH] = /* template */ `
      <h3>1. Detected Defect Types</h3>
      <ul data-type="taskList">
         <li data-type="taskItem" data-checked="false">Scratches on leather/fabric surface</li>
         <li data-type="taskItem" data-checked="false">Glue peeling / open glue</li>
         <li data-type="taskItem" data-checked="false">Wrong color / color fading</li>
         <li data-type="taskItem" data-checked="false">Sewing defects (misaligned, loose thread, excess thread)</li>
         <li data-type="taskItem" data-checked="false">Dirty, stains that cannot be cleaned</li>
         <li data-type="taskItem" data-checked="false">Shape defects (misaligned form, distorted, unbalanced)</li>
         <li data-type="taskItem" data-checked="false">Sole defects (dented, cracked, chipped)</li>
         <li data-type="taskItem" data-checked="false">Others: ...</li>
      </ul>

      <h3>2. Detailed Defect Description</h3>
      <ul data-type="bulletList">
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
      </ul>
      
      <h3>3. Illustrative Images</h3>
      <p class="my-1"><span style="color: rgb(163, 163, 163);">(Insert illustrative image)</span></p>
   `

	static readonly [Languages.CHINESE] = /* template */ `
      <h3>1. 发现的缺陷类型</h3>
      <ul data-type="taskList">
         <li data-type="taskItem" data-checked="false">皮革/布料表面划痕</li>
         <li data-type="taskItem" data-checked="false">胶水脱落 / 胶水开裂</li>
         <li data-type="taskItem" data-checked="false">颜色错误 / 色差</li>
         <li data-type="taskItem" data-checked="false">缝纫缺陷（歪斜、脱线、多余线头）</li>
         <li data-type="taskItem" data-checked="false">污渍，无法清除的污点</li>
         <li data-type="taskItem" data-checked="false">造型缺陷（形状歪斜、变形、不平衡）</li>
         <li data-type="taskItem" data-checked="false">鞋底缺陷（凹陷、裂纹、破损）</li>
         <li data-type="taskItem" data-checked="false">其他: ...</li>
      </ul>

      <h3>2. 缺陷详细描述</h3>
      <ul data-type="bulletList">
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
         <li data-type="listItem">..............................................................................................................</li>
      </ul>
      
      <h3>3. 示意图片</h3>
      <p class="my-1"><span style="color: rgb(163, 163, 163);">(插入示意图片)</span></p>
   `
}
