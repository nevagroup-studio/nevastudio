
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './icons';
import { ImageDropzone } from './ImageDropzone';
import { sourceImageToDataUrl } from '../utils';
import { generateImages } from '../services/geminiService';
import type { SourceImage, ImageSize, HistoryItem } from '../types';

interface TrendViewProps {
    addImageToLibrary: (imageDataUrl: string) => Promise<void>;
    addHistoryItem: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
    restoredSourceImage?: SourceImage | null;
    restoredPrompt?: string;
    restoredImages?: string[];
    initialFeature?: FeatureType | null;
    onBack?: () => void;
}

export type FeatureType = 'layout' | 'model' | 'diagram' | 'analyze' | 'moodboard';

interface FeatureConfig {
    id: FeatureType;
    title: string;
    description: string;
    icon: string;
    bgImage: string;
    prompt: string;
    presets: (string | { label: string; value: string })[];
}

export const TrendView: React.FC<TrendViewProps> = ({ addImageToLibrary, addHistoryItem, restoredSourceImage, restoredPrompt, restoredImages, initialFeature, onBack }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(initialFeature || null);
    
    // Generation State
    const [sourceImage, setSourceImage] = useState<SourceImage | null>(restoredSourceImage || null);
    const [prompt, setPrompt] = useState(restoredPrompt || '');
    const [imageCount, setImageCount] = useState(2);
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>(restoredImages || []);
    const [selectedImage, setSelectedImage] = useState<string | null>(restoredImages?.[0] || null);

    const features: FeatureConfig[] = [
        {
            id: 'layout',
            title: t('trendLayoutTitle'),
            description: t('trendLayoutDesc'),
            icon: 'arrow-up-tray',
            bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop',
            prompt: "Tạo một bảng trình bày kiến trúc (architectural presentation board) sử dụng thiết kế của tòa nhà này. Tạo các bản vẽ đặc trưng gồm: mặt bằng, mặt cắt, phối cảnh trục đo axonometric và 5 sơ đồ diễn tiến khối (massing evolution) từng bước. Tạo thêm các cảnh khác, nội thất, mặt đứng và khiến bảng trình bày trở nên mạch lạc và thu hút bằng bố cục và phần chữ được sắp xếp hợp lý.",
            presets: []
        },
        {
            id: 'model',
            title: t('trendModelTitle'),
            description: t('trendModelDesc'),
            icon: 'cpu-chip',
            bgImage: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop',
            prompt: "Tạo một bản vẽ chiếu vuông góc mô tả công trình này theo mặt bằng, mặt cắt và 2 mặt đứng trái – phải, nền xanh blue, nét kỹ thuật màu trắng",
            presets: []
        },
        {
            id: 'diagram',
            title: t('trendDiagramTitle'),
            description: t('trendDiagramDesc'),
            icon: 'arrows-pointing-out',
            bgImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop',
            prompt: "Exploded axonometric architectural diagram, showing functional layers, flow arrows, analytical style, clean lines, pastel colors.",
            presets: [
                {
                    label: "Phối cảnh phân tầng",
                    value: "Tạo một axonometric exploded diagram từ ảnh render này.\nGiữ đúng hình khối và tỷ lệ công trình gốc.\nXây dựng lại mô hình dưới dạng axonometric và tách thành các lớp:\n– mái\n– tầng trên\n– tầng dưới\n– mặt sàn\n– nền/đế\nHiển thị các lớp theo dạng exploded view với đường dẫn chấm thẳng đứng.\nNét mảnh, đồng đều, độ rõ cao, đơn giản hóa chi tiết nhưng giữ đúng hình học.\nThêm nhãn chú thích Mặt bằng tầng 1,2,3 theo thứ tự từ dưới lên.\nKhông thêm chi tiết mới ngoài hình gốc."
                },
                {
                    label: "Sơ đồ phân tích kiến trúc",
                    value: "Tạo một concept diagram kiến trúc bằng cách vẽ các đường sketch, nét bút chì và ghi chú lên trên ảnh render này.\nGiữ nguyên hình ảnh gốc và thêm các yếu tố diagram như:\n– mũi tên tay vẽ (hand-drawn arrows)\n– vòng cung chỉ hướng\n– ký hiệu ánh sáng, gió, mặt trời\n– ghi chú text ngắn mô tả công năng, hướng gió, ánh sáng, lối vào, khoảng mở\n– khung chữ viết tay (handwritten annotation boxes)\n– đường nét trắng nhẹ, phong cách schematic architectural diagram\n\nPhong cách: giống bản phác thảo kiến trúc sư trên mô hình, nét tự nhiên, mềm, hơi nguệch ngoạc nhưng thẩm mỹ.\nKhông làm thay đổi hình khối công trình trong ảnh gốc.\nKhông thêm chi tiết mới, chỉ overlay diagram lên trên.\nKết quả: một concept architectural diagram đẹp, trực quan, giống bản viết tay minh họa ý tưởng."
                },
                {
                    label: "Phối cảnh axonometric",
                    value: "Biến ảnh đầu vào thành phong cách biểu diễn kiến trúc dạng diagram. Giữ công trình chính nổi bật với màu sắc vật liệu phong cách technical illustration, đường nét sạch, mô hình hóa theo dạng 3D massing. Render theo phong cách axonometric / isometric.\nLàm mờ và giản lược toàn bộ bối cảnh xung quanh thành các khối trắng tinh, ít chi tiết, viền mảnh. Nhà cửa, đường phố, cây xanh chuyển thành tone trắng – xám nhạt như mô hình study mass.\nTập trung thể hiện rõ hình khối kiến trúc chính, các đường cong, tầng setback, ban công, cửa sổ trình bày bằng các đường line đều và tối giản.\nLoại bỏ texture thực tế, ánh sáng mềm, không đổ bóng mạnh.\nPhong cách tổng thể giống mô hình concept kiến trúc, minimal, clean, high-level design diagram"
                },
                {
                    label: "Sơ đồ chú thích kiến trúc",
                    value: "Hãy biến bức ảnh tôi cung cấp thành một Architectural Annotation Diagram chi tiết.\nYêu cầu:\n 1. Vẽ overlay đường viền trắng (white outline) lên toàn bộ các chi tiết kiến trúc quan trọng: mái, cột, lan can, bậc tam cấp, tượng đá, phù điêu, đá lát…\n 2. Thêm mũi tên chú thích bằng tiếng Việt + tiếng Anh cho từng bộ phận (song ngữ).\n 3. Tạo icon minh họa line-art màu trắng cho từng loại vật liệu/chi tiết như: ngói, cột đá, phù điêu, đá lát, tượng.\n 4. Mỗi icon đặt cạnh label và có đường line trắng (leader line) dẫn đến vị trí đúng trong ảnh.\n 5. Phong cách minh họa giống kiến trúc kỹ thuật: rõ ràng, sạch sẽ, cân đối, nhẹ nhàng nhưng chính xác.\n 6. Giữ ảnh chụp gốc làm nền, overlay đường viền và label lên trên như bản phân tích kiến trúc.\n 7. Xuất ra ảnh diagram hoàn chỉnh + danh sách chi tiết + mô tả ngắn về phong cách.\n8 lưu ý phải chú thích đúng vật liệu và vị trí."
                }
            ]
        },
        {
            id: 'analyze',
            title: "Poster BDS",
            description: "Tạo poster quảng cáo bất động sản chuyên nghiệp.",
            icon: 'sparkles',
            bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
            prompt: "Thiết kế poster bất động sản sang trọng, hiện đại. Bao gồm tiêu đề lớn, thông tin nổi bật, bố cục tạp chí. Giữ hình ảnh công trình làm chủ đạo.",
            presets: [
                {
                    label: "Poster Infographic Tiện ích",
                    value: "Hãy tạo một poster bất động sản cao cấp theo đúng phong cách infographic như hình mẫu:\n• Hình dự án ở dưới, chiếm 40–50% poster\n• Phía trên là danh sách tiện ích xung quanh dạng cột đứng có ảnh minh họa và số thứ tự\n• Typography sang trọng, sắc nét, mô phỏng phong cách thiết kế cao cấp quốc tế.\n\nYÊU CẦU BỐ CỤC:\n 1. Khu tiện ích (phần trên poster)\n\n • Tạo 4–6 ô tiện ích dạng hình chữ nhật đứng.\n • Mỗi ô gồm:\n• ảnh minh họa tiện ích\n• số thứ tự (01–05)\n• tiêu đề tiện ích\n• mô tả ngắn 1 dòng\n • Các ô xếp thành hàng ngang, có hiệu ứng phát sáng nhẹ.\n\n 2. Khu hình dự án\n\n • Đặt hình dự án lớn ở phần dưới poster.\n • Tăng độ sáng – độ trong – hiệu ứng ánh đèn vàng warm.\n • Giữ đúng đường nét công trình.\n\n 3. Tiêu đề chính\n\n • Text sang trọng:\nĐÓN ĐẦU NGUỒN KHÁCH DỒI DÀO QUANH NĂM\n • Hoặc AI tự đề xuất tiêu đề phù hợp.\n\n 4. Tagline dự án\n\n • Ví dụ:\nTỌA ĐỘ GIAO THƯƠNG ĐẮT GIÁ – BỨT PHÁ TIỀM NĂNG KINH DOANH\n • Font serif hoặc sans-serif luxury.\n\n 5. Logo & branding\n\n • Đặt logo dự án phía dưới phải.\n • Tông màu vàng gold / trắng.\n\n 6. Màu sắc & phong cách\n\n • Tone xanh–nâu–xám sang trọng.\n • Ánh sáng mềm, mang cảm giác cao cấp.\n • Dùng hiệu ứng chiều sâu và transition mượt giữa phần trên & dưới.\n\nOUTPUT\n\n• 1 poster hoàn chỉnh theo layout giống hình tôi gửi\n• Có tiện ích → hình dự án → tagline → logo\n• Bố cục đẹp, rõ, sang trọng — dùng được ngay cho marketing BĐS."
                },
                {
                    label: "Poster Luxury Hiện đại",
                    value: "Hãy tạo một Poster Bất động sản chuyên nghiệp từ bức ảnh tòa nhà tôi cung cấp, theo phong cách hiện đại – sang trọng như các poster dự án cao cấp.\nYêu cầu:\n\n1. Thiết kế tổng thể\n • Nền gradient tối – xanh navy hoặc xanh đêm.\n • Phía dưới là hình tòa nhà (ảnh gốc) được làm sáng, nổi bật, tăng độ sắc nét.\n • Hiệu ứng ánh sáng vàng sang trọng trên các cửa kính.\n\n2. Bố cục thông tin\n • Tiêu đề lớn, nổi bật ở trung tâm poster:\nWHERE LUXURY MEETS LOCATION (hoặc tùy chỉnh theo ảnh)\n • Dòng mô tả nhỏ phía dưới: 3 & 4 BHK Prime Residencies hoặc nội dung phù hợp.\n\n3. Icon tiện ích xung quanh\n\nTạo các vòng tròn icon kết nối bằng nét đứt:\n • Hospital\n • Educational Institutions\n • Shopping Mall\n • Restaurants\n • Upcoming Highway\n(hoặc tự động nhận diện và tạo icon phù hợp với ảnh)\n\n4. Logo dự án\n • Thêm logo/mẫu logo ở chính giữa phía dưới (tự thiết kế dạng monogram sang trọng nếu ảnh không có logo).\n • Tông màu vàng hoặc trắng.\n\n5. Footer thông tin\n • Đặt thông tin liên hệ, hotline, địa chỉ ở cuối poster.\n • Typography hiện đại, dễ đọc.\n\n6. Phong cách\n • Luxury\n • Clean, minimal nhưng ấn tượng\n • Ánh sáng cinematic\n • Layout cân đối giống poster BĐS cao cấp quốc tế.\n\nHãy xuất ra 1 Poster hoàn chỉnh với bố cục đẹp, rõ ràng, mang tính thương mại và phù hợp marketing bất động sản."
                }
            ]
        },
        {
            id: 'moodboard',
            title: t('trendMoodboardTitle'),
            description: t('trendMoodboardDesc'),
            icon: 'clipboard',
            bgImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
            prompt: "Interior design moodboard, material palette, color scheme, furniture selection, organized layout, white background.",
            presets: [
                {
                    label: "Moodboard Collage",
                    value: "Hãy tạo 1 moodboard chuyên nghiệp từ bức ảnh nội thất tôi gửi.\nYêu cầu:\n\n(1) Tách riêng đồ rời: sofa, bàn, ghế, thảm, đèn, trang trí,… làm sạch viền và cắt rời ra khỏi nền.\nSắp xếp đồ vào moodboard theo bố cục hài hòa, không chồng chéo, có chiều sâu.\n\n(2) Tạo bộ vật liệu (materials): trích xuất các chất liệu trong ảnh như gỗ, đá, vải, kim loại, trần – tường – sàn.\nTạo thành các ô vật liệu đặt phía sau hoặc cạnh đồ nội thất.\n\n(3) Tạo bảng màu (color palette) gồm 4–6 màu chính, dạng vòng tròn hoặc hình vuông, đặt gọn 1 bên.\n\n(4) Bố cục moodboard theo phong cách collage hiện đại: có layer, có arch/bo tròn, tinh tế như các moodboard tham khảo.\nNền màu trung tính (beige hoặc xám nhạt).\nKhông thay đổi hình dáng đồ nội thất.\n\n(5) Xuất ra:\n • 1 moodboard hoàn chỉnh\n • Liệt kê palette màu\n • Liệt kê vật liệu nhận diện được\n • Nhận xét phong cách nội thất của ảnh\n\nHãy giữ thẩm mỹ cao, nghệ thuật, hiện đại."
                },
                {
                    label: "Moodboard Tối giản",
                    value: "Hãy tạo một moodboard từ bức ảnh nội thất tôi cung cấp theo bố cục tối giản sạch sẽ như hình mẫu:\n • Tách tất cả đồ nội thất và decor ra khỏi nền, làm sạch cạnh.\n • Sắp xếp thành một bố cục phòng ngủ ở phần trên moodboard với nền trắng hoặc rất nhạt.\n • Tạo bảng màu từ 4–6 màu chính trong ảnh, đặt dưới moodboard tổng.\n • Tạo phần ‘item breakdown’ ở phía dưới: hiển thị từng món đồ đã tách rời và gắn nhãn tên.\n • Mọi thứ phải bố trí gọn gàng, có khoảng trống hợp lý, style minimal tự nhiên.\n • Giữ nguyên phong cách và chất liệu thật từ ảnh gốc.\n • Xuất ra moodboard hoàn chỉnh + bảng màu + danh sách đồ + vật liệu."
                },
                {
                    label: "Material Board",
                    value: "Hãy tạo một Material Board chuyên nghiệp từ bức ảnh nội thất tôi cung cấp.\n\nYêu cầu:\n 1. Tạo một phối cảnh isometric hoặc axonometric ở phía trên, thể hiện không gian như trong ảnh.\n 2. Tách toàn bộ vật liệu trong ảnh và tạo thành các mẫu vật liệu (material samples) dạng hình tròn.\n 3. Mỗi mẫu vật liệu cần được đặt phía dưới, cách đều nhau.\n 4. Vẽ đường nét đứt hoặc đường mảnh từ từng mẫu vật liệu lên đúng vị trí của nó trong phối cảnh.\n 5. Ghi tên vật liệu dưới mỗi mẫu theo mô tả thích hợp: plaster relief, brushed metal, rope texture, microcement, wood veneer, ceramic finish…\n 6. Bố cục phải giống phong cách hình mẫu: sạch, hiện đại, sáng, có nền xám/gradient nhẹ.\n 7. Thêm tiêu đề “#Materials”.\n 8. Hãy giữ nguyên vật liệu thật từ ảnh gốc và không tạo thêm vật liệu không có trong ảnh.\n\nHãy xuất ra:\n• Material Board hoàn chỉnh\n• Danh sách vật liệu nhận diện được\n• Gợi ý phong cách thiết kế từ vật liệu"
                }
            ]
        },
    ];

    const activeConfig = features.find(f => f.id === selectedFeature);

    // Sync state if props change (like during history restoration)
    useEffect(() => {
        if (initialFeature) {
            const config = features.find(f => f.id === initialFeature);
            setSelectedFeature(initialFeature);
            if (config && !prompt) setPrompt(config.prompt);
        }
    }, [initialFeature]);

    useEffect(() => {
        if (restoredImages && restoredImages.length > 0) {
            setGeneratedImages(restoredImages);
            setSelectedImage(restoredImages[0]);
        }
        if (restoredPrompt) setPrompt(restoredPrompt.replace(/\[Trend: .*?\] /, ''));
        if (restoredSourceImage) setSourceImage(restoredSourceImage);
    }, [restoredImages, restoredPrompt, restoredSourceImage]);

    const handleSelectFeature = (feature: FeatureType) => {
        setSelectedFeature(feature);
        const config = features.find(f => f.id === feature);
        if (config) setPrompt(config.prompt);
        setSourceImage(null);
        setGeneratedImages([]);
        setSelectedImage(null);
    };

    const handleInternalBack = () => {
        if (onBack) {
            onBack();
        } else {
            setSelectedFeature(null);
        }
    };

    const handleGenerate = async () => {
        if (!activeConfig || !prompt) {
            alert(t('alertEnterPrompt'));
            return;
        }
        if (!sourceImage) {
            alert(t('alertUploadSource'));
            return;
        }

        setIsLoading(true);
        setGeneratedImages([]);
        setSelectedImage(null);

        try {
            const results = await generateImages(
                sourceImage,
                prompt,
                imageCount,
                null, // referenceImage
                '4:3', // Default aspect ratio for trend tools
                language,
                undefined, // negativePrompt
                'gemini-3-pro-image-preview', // Force Pro model for trend features
                imageSize
            );

            if (results.length > 0) {
                setGeneratedImages(results);
                setSelectedImage(results[0]);
                results.forEach(img => addImageToLibrary(img));
                await addHistoryItem({
                    tab: 'trend',
                    sourceImage,
                    sourceImage2: null,
                    referenceImage: null,
                    prompt: `[Trend: ${activeConfig.title}] ${prompt}`,
                    negativePrompt: '',
                    imageCount,
                    generatedImages: results,
                    generatedPrompts: null,
                });
            } else {
                alert(t('alertGenerationFailed'));
            }
        } catch (error) {
            console.error("Trend generation failed:", error);
            alert(t('alertGenerationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    // --- Dashboard View ---
    if (!selectedFeature) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            onClick={() => handleSelectFeature(feature.id)}
                            className={`group relative h-64 rounded-3xl overflow-hidden cursor-pointer border ${theme.border} hover:border-slate-500 transition-all duration-500 shadow-2xl`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                            <div 
                                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                style={{ backgroundImage: `url(${feature.bgImage})` }}
                            ></div>
                            
                            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end items-start">
                                <div className="absolute top-6 left-6 bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-slate-600">
                                    <Icon name={feature.icon} className="w-6 h-6 text-cyan-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-cyan-300 transition-colors">{feature.title}</h2>
                                <p className="text-slate-300 text-sm max-w-xs leading-relaxed opacity-90 group-hover:text-white">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- Feature Tool View ---
    return (
        <div className="animate-fade-in w-full pb-10">
            {/* Header Bar */}
            <div className={`flex items-center gap-4 mb-6 ${theme.panelBg} p-4 rounded-xl border ${theme.border} shadow-lg`}>
                <button 
                    onClick={handleInternalBack} 
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-cyan-400/10 text-slate-300 hover:text-cyan-300 transition-all duration-300 border border-slate-700 hover:border-cyan-300/30 shadow-lg"
                    title={t('backToUtilities')}
                >
                    <Icon name="arrow-uturn-left" className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-slate-700 mx-1"></div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-2 rounded-full">
                        <Icon name={activeConfig?.icon || 'sparkles'} className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                        <h2 className={`text-xl md:text-2xl font-bold ${theme.textMain}`}>{activeConfig?.title}</h2>
                        <p className={`text-xs md:text-sm ${theme.textSub}`}>{activeConfig?.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel: Controls (1/3 width matching ControlPanel) */}
                <div className={`lg:col-span-4 xl:col-span-3 ${theme.panelBg} p-5 rounded-xl border ${theme.border} h-max shadow-2xl shadow-black/30 flex flex-col gap-5`}>
                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-3`}>1. {t('uploadImage')}</h3>
                        {sourceImage ? (
                            <div className='space-y-3'>
                                <ImageDropzone onImageUpload={setSourceImage} className="cursor-pointer rounded-lg">
                                    <div className='bg-black/30 rounded-lg p-2'>
                                        <img src={sourceImageToDataUrl(sourceImage)} alt="Source" className="w-full h-auto object-contain rounded" />
                                    </div>
                                </ImageDropzone>
                                <button onClick={() => setSourceImage(null)} className='text-red-400 hover:text-red-500 text-sm px-3 py-1.5 rounded-md hover:bg-red-500/10'>{t('delete')}</button>
                            </div>
                        ) : (
                            <ImageDropzone onImageUpload={setSourceImage} className={`w-full h-40 border-2 border-dashed ${theme.border} rounded-lg flex items-center justify-center text-center ${theme.textSub} text-sm cursor-pointer`}>
                                <div><p>{t('dropzoneHint')}</p><p className="text-xs mt-1 opacity-70">{t('dropzoneFormats')}</p></div>
                            </ImageDropzone>
                        )}
                    </section>

                    <section>
                        <h3 className={`font-semibold ${theme.textMain} mb-2`}>2. {t('prompt')}</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className={`w-full ${theme.inputBg} ${theme.textMain} p-3 rounded-md h-28 resize-none text-sm focus:ring-2 focus:ring-cyan-400/30 focus:outline-none border ${theme.border}`}
                        />
                        {activeConfig?.presets && activeConfig.presets.length > 0 && (
                            <div className="mt-2">
                                <select 
                                    onChange={(e) => setPrompt(e.target.value)} 
                                    className={`w-full ${theme.inputBg} ${theme.textMain} p-2 rounded-md text-sm border ${theme.border}`}
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- {t('choosePresetImage')} --</option>
                                    {activeConfig.presets.map((preset, idx) => {
                                        const label = typeof preset === 'string' ? preset : preset.label;
                                        const value = typeof preset === 'string' ? preset : preset.value;
                                        return (
                                            <option key={idx} value={value}>{label}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                    </section>

                    <div className="grid grid-cols-2 gap-4">
                        <section>
                            <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageCount')}</h3>
                            <div className={`flex items-center justify-between ${theme.inputBg} rounded-md p-2 border ${theme.border}`}>
                                <button onClick={() => setImageCount(Math.max(1, imageCount - 1))} className={`px-3 py-1 rounded font-bold ${theme.buttonSecondary}`}>-</button>
                                <span className={`font-semibold ${theme.textMain}`}>{imageCount}</span>
                                <button onClick={() => setImageCount(Math.min(4, imageCount + 1))} className={`px-3 py-1 rounded font-bold ${theme.buttonSecondary}`}>+</button>
                            </div>
                        </section>
                        <section>
                            <h3 className={`font-semibold ${theme.textMain} mb-2`}>{t('imageSize')}</h3>
                            <select 
                                value={imageSize} 
                                onChange={(e) => setImageSize(e.target.value as ImageSize)} 
                                className={`w-full ${theme.inputBg} ${theme.textMain} p-2.5 rounded-md text-sm border ${theme.border}`}
                            >
                                <option value="1K">1K</option>
                                <option value="2K">2K</option>
                                <option value="4K">4K</option>
                            </select>
                        </section>
                    </div>

                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !sourceImage} 
                        className="w-full neva-primary-button font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed text-base mt-2"
                    >
                        <Icon name="sparkles" className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? t('generating') : t('createImage')}
                    </button>
                </div>

                {/* Right Panel: Results (2/3 width matching GalleryPanel) */}
                <div className={`lg:col-span-8 xl:col-span-9 ${theme.panelBg} p-4 rounded-xl border ${theme.border} shadow-2xl shadow-black/30 min-h-[60vh] lg:min-h-0`}>
                    <div className='h-full max-h-[85vh] overflow-y-auto pr-2'>
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <Icon name="sparkles" className="w-16 h-16 animate-spin text-cyan-300 mx-auto mb-6" />
                                <h3 className={`text-xl font-semibold ${theme.textMain} mb-2`}>{t('generating')}...</h3>
                                <p className={`${theme.textSub} text-sm max-w-md`}>{t('loadingMessageDefault')}</p>
                            </div>
                        ) : generatedImages.length > 0 && selectedImage ? (
                            <div className="flex flex-col h-full w-full">
                                <div className="flex-grow flex items-center justify-center relative group bg-black/30 rounded-lg overflow-hidden">
                                    <img src={selectedImage} alt="Result" className="max-w-full max-h-[75vh] object-contain shadow-lg" />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <a 
                                            href={selectedImage} 
                                            download={`trend-${activeConfig?.id}-${Date.now()}.png`} 
                                            className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg" 
                                            title={t('downloadImage')}
                                        >
                                            <Icon name="download" className="w-6 h-6" />
                                        </a>
                                    </div>
                                </div>
                                
                                {generatedImages.length > 1 && (
                                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2 justify-center">
                                        {generatedImages.map((img, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => setSelectedImage(img)}
                                                className={`relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-cyan-300/50 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            >
                                                <img src={img} alt={`Result ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`h-full flex flex-col items-center justify-center text-center ${theme.textSub}`}>
                                <Icon name={activeConfig?.icon || 'sparkles'} className="w-24 h-24 mx-auto mb-6 opacity-50" />
                                <h3 className="text-2xl font-bold">{t('emptyStateHeader')}</h3>
                                <p className="mt-2 text-lg">{t('emptyStateText')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
