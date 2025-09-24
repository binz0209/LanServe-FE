import Input from '../components/ui/input'
import Textarea from '../components/ui/textarea'
import Select from '../components/ui/select'
import Button from '../components/ui/button'
export default function NewProject() {
    return (
        <div className="container-ld py-10">
            <h1 className="text-3xl font-semibold text-center">Đăng dự án mới</h1>
            <div className="mt-8 space-y-6">
                <div className="card"><div className="card-header p-5 font-semibold">Thông tin dự án</div>
                    <div className="card-body grid md:grid-cols-2 gap-4">
                        <div><label className="text-sm">Tiêu đề dự án *</label><Input placeholder="VD: Thiết kế logo cho công ty công nghệ" /></div>
                        <div><label className="text-sm">Danh mục *</label><Select defaultValue="design"><option value="design">Thiết kế</option><option value="dev">Lập trình</option></Select></div>
                        <div className="md:col-span-2"><label className="text-sm">Mô tả dự án *</label><Textarea placeholder="Mô tả chi tiết yêu cầu, mục tiêu và kỳ vọng..." /></div>
                    </div>
                </div>
                <div className="card"><div className="card-header p-5 font-semibold">Ngân sách</div>
                    <div className="card-body grid md:grid-cols-2 gap-4">
                        <div><label className="text-sm">Loại ngân sách *</label>
                            <div className="mt-2 flex gap-6 text-sm"><label className="flex items-center gap-2"><input type="radio" name="budget" defaultChecked /> Giá cố định</label><label className="flex items-center gap-2"><input type="radio" name="budget" /> Theo giờ</label></div>
                        </div>
                        <div><label className="text-sm">Tổng ngân sách (VND) *</label><Input defaultValue="5000000" /></div>
                    </div>
                </div>
                <div className="card"><div className="card-header p-5 font-semibold">Thời gian</div>
                    <div className="card-body grid md:grid-cols-2 gap-4">
                        <div><label className="text-sm">Thời gian hoàn thành *</label><Input placeholder="Chọn mốc thời gian" /></div>
                    </div>
                </div>
                <div className="card"><div className="card-header p-5 font-semibold">Kỹ năng cần thiết</div>
                    <div className="card-body grid md:grid-cols-3 gap-3 text-sm">
                        {['React', 'Node.js', 'Python', 'Figma', 'SEO', 'Content Writing', 'Translation', 'Facebook Ads', 'Video Editing'].map(x => <label key={x} className="flex items-center gap-2"><input type="checkbox" /> {x}</label>)}
                    </div>
                </div>
                <div className="flex justify-end gap-3"><Button variant="outline">Hủy bỏ</Button><Button>Đăng dự án</Button></div>
            </div>
        </div>
    )
}