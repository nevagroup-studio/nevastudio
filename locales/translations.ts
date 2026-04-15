
const interiorLightingOptions = [
    { display: "-- Chọn ánh sáng nội thất --", value: "" },
    { display: "Tự nhiên ban ngày qua cửa sổ", value: "ánh sáng tự nhiên ban ngày dịu nhẹ chiếu qua cửa sổ lớn" },
    { display: "Đèn trần ấm áp (vàng)", value: "ánh sáng vàng ấm áp từ hệ thống đèn trần downlight và đèn hắt" },
    { display: "Ánh sáng studio (trắng)", value: "ánh sáng trắng, đều và mềm mại như trong studio, không có bóng gắt" },
    { display: "Hoàng hôn chiếu vào phòng", value: "ánh sáng hoàng hôn màu cam ấm áp chiếu xiên vào phòng, tạo bóng đổ dài" },
    { display: "Ban đêm (đèn và trăng)", value: "ánh sáng ban đêm kết hợp giữa đèn nội thất và ánh trăng xanh dịu hắt từ bên ngoài" },
    { display: "Nghệ thuật: Cinematic huyền ảo", value: "ánh sáng cinematic with các luồng tia sáng (god rays) xuyên qua màn sương mỏng, tạo không khí huyền ảo and chiều sâu" },
    { display: "Nghệ thuật: Neon tương phản", value: "ánh sáng neon màu hồng and xanh lam tương phản mạnh, tạo phong cách cyberpunk hoặc retro-futuristic" },
    { display: "Nghệ thuật: Lò sưởi ấm cúng", value: "ánh sáng ấm áp, lung linh từ một lò sưởi đang cháy, tạo bóng đổ mềm mại and không khí ấm cúng, thân mật" },
    { display: "Nghệ thuật: Low-key kịch tính", value: "ánh sáng low-key with nguồn sáng chính duy nhất, tạo độ tương phản cao giữa sáng and tối, làm nổi bật hình khối and tạo cảm giác kịch tính" },
    { display: "Nghệ thuật: Bắc Âu 'Hygge'", value: "ánh sáng dịu nhẹ, phân tán từ nhiều nguồn đèn nhỏ and nến, tạo cảm giác 'hygge' thư giãn and ấm cúng kiểu Bắc Âu" }
];

const materialTypeOptions = [
    { display: "Gạch lát sàn", value: "gạch lát sàn" },
    { display: "Gạch ốp tường", value: "gạch ốp tường" },
    { display: "Đá tự nhiên", value: "đá tự nhiên" },
    { display: "Gỗ ván sàn", value: "gỗ ván sàn" },
    { display: "Tấm ốp trang trí", value: "tấm ốp trang trí" }
];

const tileSizeOptions = [
    { display: "600x600", value: "kích thước 600x600 mm" },
    { display: "800x800", value: "kích thước 800x800 mm" },
    { display: "600x1200", value: "kích thước 600x1200 mm" },
    { display: "1200x1200", value: "kích thước 1200x1200 mm" },
    { display: "150x900 (Gỗ)", value: "kích thước 150x900 mm" },
    { display: "Khổ lớn (Slab)", value: "khổ lớn slab" }
];

const materialPropertyOptions = [
    { display: "Bóng (Polished)", value: "bề mặt bóng polished phản chiếu ánh sáng" },
    { display: "Mờ (Matt)", value: "bề mặt mờ matt không phản chiếu" },
    { display: "Sần (Structured)", value: "bề mặt sần structured có độ nhám" },
    { display: "Bán bóng (Lappato)", value: "bề mặt bán bóng lappato" }
];

const tilePatternOptions = [
    { display: "Lát thẳng", value: "kiểu lát thẳng nối tâm" },
    { display: "Lát chữ công (1/2)", value: "kiểu lát chữ công so le 1/2" },
    { display: "Lát xương cá (Herringbone)", value: "kiểu lát xương cá herringbone" },
    { display: "Lát ngẫu nhiên", value: "kiểu lát ngẫu nhiên" }
];

const exteriorLightingOptions = [
    { display: "-- Chọn ánh sáng ngoại thất --", value: "" },
    { display: "Giữa trưa nắng gắt", value: "ánh sáng ban ngày gay gắt vào giữa trưa, trời trong xanh, tạo bóng đổ sắc nét" },
    { display: "Hoàng hôn vàng rực", value: "ánh sáng hoàng hôn vàng rực, bầu trời có mây màu cam and tím" },
    { display: "Bình minh trong trẻo", value: "ánh sáng bình minh trong trẻo, có sương nhẹ, không khí yên bình" },
    { display: "Trời u ám, sắp mưa", value: "bầu trời u ám, mây xám, ánh sáng khuếch tán mềm mại, không có bóng gắt" },
    { display: "Ban đêm, đèn đô thị", value: "bối cảnh ban đêm ở thành phố, công trình được chiếu sáng bởi đèn đường and đèn từ các tòa nhà quanh" },
    { display: "Nghệ thuật: Bão tố kịch tính", value: "bầu trời giông bão kịch tính with những tia sét lóe lên ở phía xa, chiếu sáng công trình một cách chớp nôáng and mạnh mẽ" },
    { display: "Nghệ thuật: Rừng sương mù", value: "công trình chìm trong một khu rừng sương mù huyền ảo, ánh sáng mặt trời khuếch tán qua tán lá and màn sương" },
    { display: "Nghệ thuật: Mưa đêm Cyberpunk", value: "đêm mưa trong thành phố cyberpunk, ánh sáng neon từ các biển hiệu phản chiếu on vũng nước và bề mặt vắt của công trình" },
    { display: "Nghệ thuật: Ảo ảnh sa mạc", value: "ánh sáng sa mạc gay gắt tạo hiệu ứng ảo ảnh nhiệt (mirage), làm biến dạng nhẹ không khí xung quanh chân công trình" },
    { display: "Nghệ thuật: Cực quang huyền ảo", value: "bầu trời đêm được chiếu sáng bởi cực quang (northern lights) with các dải màu xanh lá cây và tím huyền ảo" }
];

const interiorLightingOptionsEn = [
    { display: "-- Select interior lighting --", value: "" },
    { display: "Natural Daylight from Window", value: "soft natural daylight streaming through a large window" },
    { display: "Warm Ceiling Lights (Yellow)", value: "warm yellow light from a system of downlights and recessed lighting" },
    { display: "Studio Lighting (White)", value: "even, soft white light as in a studio, with no harsh shadows" },
    { display: "Sunset Glow into Room", value: "warm orange sunset light streaming into the room at an angle, creating long shadows" },
    { display: "Nighttime (Lamps & Moonlight)", value: "nighttime lighting combining interior lamps and soft blue moonlight from outside" },
    { display: "Artistic: Mystical Cinematic", value: "cinematic lighting with god rays piercing through a thin haze, creating a mystical atmosphere and depth" },
    { display: "Artistic: Contrasting Neon", value: "high-contrast neon lighting in pink and cyan, creating a cyberpunk or retro-futuristic style" },
    { display: "Artistic: Cozy Fireplace", value: "warm, flickering light from a burning fireplace, casting soft shadows and creating a cozy, intimate atmosphere" },
    { display: "Artistic: Dramatic Low-key", value: "low-key lighting with a single main light source, creating high contrast between light and shadow, highlighting Custom elements and creating a dramatic feel" },
    { display: "Artistic: Nordic 'Hygge'", value: "soft, diffused light from multiple small lamps and candles, creating a relaxing and cozy Nordic 'hygge' feeling" }
];

const materialTypeOptionsEn = [
    { display: "Floor Tiles", value: "floor tiles" },
    { display: "Wall Tiles", value: "wall tiles" },
    { display: "Natural Stone", value: "natural stone" },
    { display: "Wood Flooring", value: "wood flooring" },
    { display: "Decorative Panels", value: "decorative panels" }
];

const tileSizeOptionsEn = [
    { display: "600x600", value: "600x600 mm size" },
    { display: "800x800", value: "800x800 mm size" },
    { display: "600x1200", value: "600x1200 mm size" },
    { display: "1200x1200", value: "1200x1200 mm size" },
    { display: "150x900 (Wood)", value: "150x900 mm size" },
    { display: "Large Slab", value: "large slab" }
];

const materialPropertyOptionsEn = [
    { display: "Polished", value: "polished surface reflecting light" },
    { display: "Matt", value: "matt surface, non-reflective" },
    { display: "Structured", value: "structured surface with texture" },
    { display: "Lappato", value: "lappato semi-polished surface" }
];

const tilePatternOptionsEn = [
    { display: "Straight", value: "straight tiling pattern" },
    { display: "Offset (1/2)", value: "1/2 offset tiling pattern" },
    { display: "Herringbone", value: "herringbone tiling pattern" },
    { display: "Random", value: "random tiling pattern" }
];

const exteriorLightingOptionsEn = [
    { display: "-- Select exterior lighting --", value: "" },
    { display: "Harsh Midday Sun", value: "harsh midday daylight, clear blue sky, creating sharp, defined shadows" },
    { display: "Golden Hour Sunset", value: "vibrant golden hour sunset, with a sky of orange and purple clouds" },
    { display: "Crisp Early Morning", value: "crisp early morning light, with a hint of mist, peaceful atmosphere" },
    { display: "Overcast, Pre-storm", value: "overcast sky, grey clouds, soft diffused light, no harsh shadows" },
    { display: "Night, Urban Lights", value: "nighttime city scene, building illuminated by streetlights and light from surrounding buildings" },
    { display: "Artistic: Dramatic Storm", value: "a dramatic stormy sky with distant lightning flashes, illuminating the building intermittently and powerfully" },
    { display: "Artistic: Misty Forest", value: "the building is enveloped in a mystical foggy forest, with sunlight diffusing through the canopy and mist" },
    { display: "Artistic: Cyberpunk City Rain", value: "a rainy night in a cyberpunk city, with neon light from signs reflecting off puddles and the wet surfaces of the building" },
    { display: "Artistic: Desert Mirage", value: "harsh desert light creating a heat mirage effect, slightly distorting the air around the base of the building" },
    { display: "Artistic: Northern Lights", value: "the night sky is illuminated by the aurora borealis (northern lights) with mystical green and purple bands of color" }
];

export const translations = {
    vi: {
        appTitle: "NEVA Studio",
        selectModel: "Chá»n mÃ´ hÃ¬nh",
        apiKeyModalTitle: "DÃ¡n API key Google AI Studio",
        apiKeyModalDescription: "Nháº­p API key cá»§a báº¡n vÃ  nháº¥n xÃ¡c nháº­n. Key sáº½ Ä‘Æ°á»£c lÆ°u cho nhá»¯ng láº§n sá»­ dá»¥ng sau trÃªn thiáº¿t bá»‹ nÃ y.",
        apiKeyPlaceholder: "DÃ¡n API key tá»« Google AI Studio vÃ o Ä‘Ã¢y...",
        apiKeyStorageHint: "API key Ä‘Æ°á»£c lÆ°u cá»¥c bá»™ trÃªn trÃ¬nh duyá»‡t nÃ y.",
        apiKeySavedDescription: "API key Ä‘Ã£ Ä‘Æ°á»£c lÆ°u vÃ  sáº½ Ä‘Æ°á»£c dÃ¹ng láº¡i á»Ÿ nhá»¯ng láº§n sau.",
        apiKeySavedShort: "ÄÃ£ lÆ°u key",
        apiKeyEmptyError: "Vui lÃ²ng dÃ¡n API key trÆ°á»›c khi xÃ¡c nháº­n.",
        apiKeySaveError: "KhÃ´ng thá»ƒ lÆ°u API key trÃªn thiáº¿t bá»‹ nÃ y.",
        developedBy: "Phát triển bởi NEVA Studio",
        sponsoredBy: "Đồng hành bảo trợ phát triển VietCG",
        apiVersionWarning: "Phiên bản này cần có API của google để hoạt động xem hướng dẫn bên phải",
        changeLanguage: "Thay đổi ngôn ngữ",
        welcomeHeader: "NEVA Studio",
        welcomeDescription: "Ứng dụng AI cho kiến trúc và nội thất. Biến ý tưởng thành hình ảnh làm việc ngay.",
        welcomeStartButton: "Get Started",
        navHome: "TRANG CHỦ",
        navHistory: "LỊCH SỬ",
        navSettings: "CÀI ĐẶT",
        settingsTitle: "CÀI ĐẶT",
        appearance: "Giao diện",
        theme: "Chủ đề",
        themeDark: "Tối",
        themeLight: "Sáng",
        themeWarm: "Ấm (Mặc định)",
        themeCold: "Lạnh",
        toolLabel: "CÔNG CỤ AI",
        freeGenTitle: "Tạo ảnh Miễn Phí",
        freeGenDesc: "Tạo hình ảnh chất lượng cao từ văn bản miễn phí.",
        proGenTitle: "Tạo ảnh bằng API",
        proGenDesc: "Sử dụng model mạnh nhất (Gemini 3 Pro) để tạo ảnh chi tiết cao.",
        tabCreate: "Tạo Ảnh",
        tabArchitecture: "Kiến trúc",
        tabInterior: "Nội thất",
        tabPlanning: "Quy hoạch",
        tabCameraAngle: "Sáng tạo view",
        subTabCameraAngle: "Góc camera",
        tabEdit: "Chỉnh sửa",
        tabPlanTo3D: "Mặt bằng",
        tabCanvaMix: "Canva Mix",
        tabCreatePrompt: "Magic Prompt",
        tabTrend: "Trend",
        tabCreateVideo: "Tạo Video",
        library: "Thư viện",
        tabUtilities: "Tiện ích",
        selectionTool: "Công cụ vẽ vùng chọn",
        drawTool: "Nét vẽ",
        rectTool: "Hình chữ nhật",
        strokeWidth: "Độ dày nét vẽ",
        clearDrawing: "Xóa nét vẽ",
        uploadImage: "Tải ảnh lên",
        uploadImageOptional: "Tải ảnh lên (Tùy chọn)",
        handDrawnHint: "Ưu tiên ảnh vẽ tay, ảnh sketchup không bóng đổ và bao cảnh",
        referenceImage: "Ảnh tham chiếu (Style)",
        prompt: "Prompt",
        negativePrompt: "Prompt loại trừ (Negative Prompt)",
        negativePromptHelp: "Liệt kê những thứ bạn không muốn xuất hiện trong ảnh. Ví dụ: xấu xí, biến dạng, chất lượng thấp, mờ, chữ ký...",
        aspectRatio: "Tỷ lệ khung hình",
        imageCount: "Số lượng ảnh",
        imageSize: "Kích thước (Chỉ dùng cho API)",
        dropzoneHint: "Kéo thả, dán, hoặc click",
        dropzoneFormats: "PNG, JPG, WEBP",
        delete: "Xóa",
        choosePresetImage: "Chọn ảnh có sẵn",
        close: "Đóng",
        referenceImageHelp: "AI sẽ lấy cảm hứng về phong cách, ánh sáng, bối cảnh và vật liệu.",
        processingImage: "Đang xử lý ảnh...",
        addFromPresets: "Or chọn prompt có sẵn để thêm vào:",
        style: "Phong cách",
        context: "Bối cảnh",
        lighting: "Ánh sáng",
        roomType: "Loại phòng",
        planningObject: "Đối tượng",
        planningStyle: "Phong cách",
        planningStructure: "Công trình",
        aspectRatioHelp: "Chỉ có hiệu lực khi không tải lên 'Ảnh gốc'.",
        generateFromImage: "Prompt từ ảnh",
        generateFromPromptText: "Prompt từ Prompt",
        generating: "Đang tạo...",
        specifyCloseUpAngle: "Chỉ định góc cận cảnh (Tùy chọn)",
        specifyCloseUpHelp: "Vẽ một hình chữ nhật trên ảnh để AI tự động render cận cảnh khu vực đó.",
        selectArea: "Chọn vùng",
        cancel: "Hủy",
        clearSelection: "Xóa vùng chọn",
        chooseCameraAngle: "Chọn góc camera",
        selectCameraAnglePlaceholder: "-- Chọn góc camera --",
        customDescription: "Mô tả tùy chỉnh",
        customDescriptionPlaceholder: "Ví dụ: chụp từ góc 3/4 từ dưới lên...",
        chooseFunction: "Chọn chức năng",
        editSelectedArea: "Sửa vùng chọn",
        smartEdit: "Chỉnh sửa Thông minh",
        mergeHouse: "Ghép nhà",
        mergeMaterial: "Thay vật liệu",
        mergeFurniture: "Thay nội thất",
        editFunctionHelp: {
            inpaint: "Xóa hoặc thay thế đối tượng trong ảnh bằng cách vẽ vùng chọn và nhập mô tả.",
            smartEdit: "Chỉnh sửa độ nét cao bằng cách chọn vùng làm việc (khung) và tô vùng thay đổi (mask).",
            mergeHouse: "Ghép một công trình mới vào bối cảnh có sẵn.",
            mergeMaterial: "Áp dụng vật liệu từ ảnh thứ hai lên đối tượng trong ảnh gốc.",
            mergeFurniture: "Thay thế đồ nội thất trong ảnh gốc bằng đồ từ ảnh thứ hai.",
            canva: "Ghép nhiều đồ rời (PNG tách nền) vào không gian với tỉ lệ và ánh sáng thực tế."
        },
        uploadSourceImage: "Tải ảnh gốc",
        uploadContextImage: "Tải ảnh bối cảnh (Ảnh 1)",
        contextImageHelp: "Ảnh bối cảnh đã bôi đỏ phần khu đất cần ghép nhà",
        resetImage: "Sóa Ảnh & Bắt đầu lại",
        chooseToolAndDraw: "Chọn công cụ & Vẽ vùng chọn",
        lassoTool: "Lasso",
        brushTool: "Tô (Brush)",
        lineThickness: "Độ dày đường viền",
        brushSize: "Kích thước cọ",
        uploadReferenceOptional: "Tải ảnh tham chiếu (Tùy chọn)",
        referenceImageHelpEdit: "AI sẽ lấy cảm hứng từ ảnh này để thay đổi vùng đã chọn.",
        uploadBuildingImage: "Tải ảnh công trình (Ảnh 2)",
        uploadMaterialFurnitureImage: "Tải ảnh vật liệu/nội thất (Ảnh 2)",
        image2Help: "Lưu ý nên tách nền và tỷ lệ ảnh 2 gần bằng tỷ lệ ảnh 1. Ví dụ cùng tỷ lệ 3:4.",
        promptPlaceholder: {
            create: "Ví dụ: một ngôi nhà hiện đại, ánh sáng ban ngày, ảnh thực tế...",
            negative: "ví dụ: chữ, chữ ký, chất lượng thấp, nhiễu",
            inpaint: "Ví dụ: thêm một cửa sổ kiểu vòm...",
            smartEdit: "Mô tả thay đổi cho vùng mask bên trong khung...",
            mergeHouse: "Mô tả cách ghép hai ảnh...",
            mergeMaterial: "Ví dụ: Thay thảm ở ảnh 1 bằng thảm họa tiết trong ảnh 2",
            mergeFurniture: "Mô tả cách ghép hai ảnh...",
            planTo3dRender: "Phòng khách hiện đại...",
            planTo3dColorize: "Tông màu pastel...",
            video: "Mô tả chuyển động...",
            videoPrompt: "Ví dụ: một cảnh flycam bay chậm từ xa lại gần công trình...",
            vr360: "Ví dụ: sảnh chờ khách sạn sang trọng, ảnh toàn cảnh 360 độ, kiến trúc hiện đại..."
        },
        promptExamples: "Hoặc chọn prompt mẫu:",
        selectOption: "-- Chọn một tùy chọn --",
        upload2dPlan: "Tải bản vẽ 2D",
        chooseGoal: "Chọn mục tiêu",
        create3DImage: "Tạo ảnh 3D",
        colorizePlan: "Tổ màu mặt bằng",
        analyzePlanPrompt: "Phân tích style mẫu",
        suggestions: "Gợi ý",
        motionDescription: "Mô tả chuyển động",
        selectSuggestion: "-- Chọn một gợi ý --",
        uploadSpaceImage: "Tải ảnh không gian (nền)",
        changeBgImage: "Thay đổi ảnh nền",
        clickOrDropNew: "Click hoặc kéo thả ảnh mới",
        deleteAll: "Xóa tất cả",
        uploadDecorImage: "Tải ảnh đồ decor (tách nền)",
        decorHelp: "Nên dùng ảnh đã tách nền (PNG)",
        clickToAdd: "Click để thêm vào canvas",
        adjustments: "Tinh chỉnh",
        lockLayout: "Khóa Layout",
        deleteObject: "Xóa đối tượng (hoặc dùng phím Backspace)",
        rotate: "Xoay",
        flipHorizontal: "Lật ngang",
        flipVertical: "Lật dọc",
        uploadToAnalyze: "Tải ảnh lên để phân tích",
        analyzeHelp: "AI sẽ phân tích ảnh và tạo ra 20 prompt nhiếp ảnh chuyên nghiệp.",
        uploadCharacterImage: "Tải ảnh nhân vật (Tùy chọn)",
        characterHelp: "AI sẽ phân tích và đưa nhân vật này vào các góc chụp có người.",
        characterDescriptionLabel: "Nhân vật trong ảnh",
        analyzingCharacter: "Đang phân tích nhân vật...",
        uploadStartImage: "Tải ảnh bắt đầu",
        virtualTourHelp: "Tải lên một ảnh render 3D để bắt đầu chuyến tham quan ảo.",
        createImage: "Tạo Ảnh",
        createVideo: "Tạo Video",
        createPrompt: "Tạo Prompt",
        choosePresetMaterial: "Chọn vật liệu có sẵn",
        loadingReference: "Đang tải ảnh...",
        loadingStart: "Bắt đầu quá trình tạo...",
        loadingAnalyzePrompts: "Đang phân tích ảnh và tạo prompts...",
        loadingAnalyzingArea: "Đang phân tích và tái tạo chi tiết vùng chọn...",
        loadingMessageDefault: "Đang tạo ảnh, xin đợi một chút...",
        loadingUsageLimit: "Giới hạn sử dụng NEVA Studio:",
        loadingUsageText: "Mỗi người dùng có thể tạo từ 40 – 45 hình ảnh mỗi ngày. Để tăng số lượt tạo ảnh, bạn có thể sử dụng 2–3 địa chỉ Gmail khác nhau.",
        loadingUsageNote: "👉 Lưu ý: Mỗi email nên đăng nhập ở một trình duyệt hoặc tab Chrome riêng biệt để tránh xung đột tài khoản.",
        loadingAdText: "Nếu bạn muốn tạo ảnh đẹp hơn có thể tham khảo các khóa học Ứng dụng Ai trong kiến trúc, nội thất của AIAI - Lh 0387414593",
        loadingVideoHeader: "AI đang tạo video của bạn...",
        loadingVideoHelp: "Quá trình tạo video có thể mất vài phút. Vui lòng không đóng hoặc tải lại trang.",
        loadingPromptHeader: "Đang tạo prompts...",
        loadingPromptHelp: "AI đang phân tích hình ảnh của bạn để tạo ra các mô tả nhiếp ảnh độc đáo.",
        emptyStateHeader: "Kết Quả Render",
        emptyStateText: "Kết quả sẽ xuất hiện ở đây.",
        emptyCanvaHeader: "Không gian sáng tạo của bạn",
        emptyCanvaText: "Tải lên 'ảnh không gian' ở bảng điều khiển để bắt đầu.",
        emptyPromptHeader: "Gợi ý Prompt chuyên nghiệp",
        emptyPromptText: "Tải lên một ảnh ở bảng điều khiển và AI sẽ tạo ra 20 prompt theo phong cách nhiếp ảnh gia.",
        emptyTourHeader: "Tham quan ảo",
        emptyTourText: "Tải lên một ảnh render ở bảng điều khiển để bắt đầu chuyến tham quan của bạn.",
        tourHistory: "Lịch sử chuyến tham quan",
        fullscreen: "Xem toàn màn hình",
        editThisImage: "Chỉnh sửa ảnh này",
        useAsSource: "Sử dụng làm ảnh nguồn",
        downloadImage: "Tải ảnh",
        downloadVideo: "Tải video",
        copyPrompt: "Copy prompt",
        noPrompt: "Chưa có prompt",
        createFromThisPrompt: "Tạo ảnh từ prompt này",
        tourUndo: "Hoàn tác",
        tourRedo: "Lạnh lại",
        saveToLibrary: "Lưu vào thư viện",
        saved: "Đã lưu!",
        history: "Lịch sử",
        clearAll: "Xóa tất cả",
        deleteSelected: "Xóa mục đã chọn",
        selectMultiple: "Chọn nhiều",
        cancelSelection: "Hủy chọn",
        confirmClearLibrary: "Bạn có chắc muốn xóa toàn bộ thư viện không?",
        clearHistoryConfirm: "Bạn có chắc muốn xóa toàn bộ lịch sử để ứng dụng mượt mà hơn không?",
        review: "Xem lại",
        images: "ảnh",
        prompts: "Prompts",
        historyEmpty: "Kết quả từ các lần tạo ảnh trước sẽ được lưu ở đây.",
        historyPerformanceTip: "Xóa lịch sử định kỳ giúp ứng dụng hoạt động mượt mà hơn.",
        libraryEmptyHeader: "Thư viện của bạn trống",
        libraryEmptyText: "Lưu những hình ảnh bạn thích từ bảng kết quả để xem lại sau.",
        deleteFromLibrary: "Xóa khỏi viện",
        closeFullscreen: "Đóng",
        editImage: "Chỉnh sửa ảnh",
        reset: "Reset",
        saveImage: "Lưu ảnh",
        apiKeyRequired: "Yêu cầu API Key",
        apiKeyDescription: "Để sử dụng tính năng tạo video, bạn cần chọn một API Key từ dự án Google Cloud của bạn. Tính năng này sử dụng model Veo và có thể phát sinh chi phí.",
        apiKeyBillingInfo: "Để biết thêm thông tin về giá, vui lòng tham khảo",
        billingDocs: "tài liệu thanh toán",
        selectApiKey: "Chọn API Key",
        alertUploadSource: "Vui lòng tải lên ảnh nguồn.",
        alertDrawMask: "Vui lòng vẽ một vùng chọn trên ảnh để chỉnh sửa.",
        alertSelectSmartBox: "Vui lòng khoanh khung làm việc (Bước 1) trên ảnh.",
        alertSelectSmartMask: "Vui lòng tô vùng cần sửa (Bước 2) bên trong khung.",
        alertUploadBothImages: "Vui lòng tải lên cả hai ảnh để thực hiện.",
        alertUploadBg: "Vui lòng tải lên ảnh không gian (nền).",
        alertUploadDecor: "Vui lòng tải lên ít nhất một ảnh đồ decor.",
        alertEnterPrompt: "Vui lòng nhập mô tả (prompt).",
        alertGenerationFailed: "Đã xảy ra lỗi khi tạo. Vui lòng kiểm tra API key và thử lại.",
        alertInvalidApiKey: "API Key không hợp lệ hoặc đã bị xóa. Vui lòng chọn một API Key khác.",
        alertNoSourceForPrompt: "Không tìm thấy ảnh nguồn từ tab Tạo Prompt. Vui lòng thử lại.",
        alertImageGenFailedRetry: "Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.",
        alertTourFailed: "Đã xảy ra lỗi khi tạo khung hình tiếp theo.",
        alertApiKeyUtilUnavailable: "API Key selection utility is not available.",
        alertImageGenFailed: "AI did not return any images.",
        alertMoodboard: "Vui lòng tải lên ảnh nguồn cảm hứng và nhập mô tả chủ đề.",
        alertLighting: "Vui lòng tải ảnh lên và chọn ít nhất một loại ánh sáng.",
        alertVideoPrompt: "Vui lòng tải lên ảnh nguồn và nhập yêu cầu chuyển động.",
        alertStyleChange: "Vui lòng tải ảnh, nhập yêu cầu style, và tạo prompt trước khi tạo ảnh.",
        alertStylePromptGen: "Vui lòng tải ảnh và nhập yêu cầu style để tạo prompt.",
        alertSelectArea: "Vui lòng chọn một khu vực trên ảnh trước.",
        donate: "Donate",
        promptInitial: "Ảnh chụp thực tế ngôi nhà",
        promptInterior: "Ảnh chụp thực tế nội thất",
        promptInitialPlanning: "ảnh chụp thực tế Master Plan view nhìn chim bay từ trên cao của",
        promptCloseUp: "Góc chụp cận cảnh tập trung vào chi tiết của",
        promptCanvaMix: "Canva Mix generation",
        promptArchitecturalGenerated: "Đã tạo Prompts kiến trúc",
        defaultNegativePrompt: "cartoon, 2d illustration, sketch, cgi, render artifact, fake render, unreal engine style, game asset, lowpoly, plastic surface, wax texture, flat lighting, incorrect reflections, overexposed, underexposed, low contrast, washed out, noisy, blurry, depth map error, distorted perspective, unrealistic scale, fake shadows, wrong proportion, low resolution, low detail, low quality, over-saturated, oversharpened edges, halo, outline, glowing edges, bad composition, incorrect DOF, cutout, text, watermark, logo, posterized, painting, drawing, toy-like, artificial lighting, non-realistic material, duplicated objects, blurry wall texture, flat materials, poor texture mapping, distorted lines, model border",
        utilitiesTitle: "Tiện ích Mở rộng",
        moodboardTitle: "Tạo Moodboard",
        moodboardDesc: "Tải lên một hình ảnh và nhập mô tả để AI tạo ra một bảng cảm hứng (moodboard) hoàn chỉnh with bảng màu, vật liệu và hình ảnh liên quan.",
        videoPromptTitle: "Kịch bản Video",
        videoPromptDesc: "Tạo kịch bản chuyển động chi tiết cho video kiến trúc.",
        lightingTitle: "Thiết lập Ánh sáng",
        lightingDesc: "Thử nghiệm các kịch bản chiếu sáng khác nhau cho mô hình của bạn.",
        virtualTourTitle: "Tham quan ảo",
        virtualTourDesc: "Tải lên một ảnh render 3D và di chuyển trong không gian bằng AI.",
        extendViewTitle: "Mở rộng View",
        extendViewDesc: "Mở rộng khung hình của ảnh theo tỉ lệ mong muốn bằng cách AI tự động vẽ thêm phần còn thiếu.",
        changeStyleTitle: "Thay đổi Style",
        changeStyleDesc: "Tải ảnh lên, mô tả phong cách mới và AI sẽ tạo ra một prompt chuyên nghiệp để biến đổi hình ảnh của bạn.",
        interiorViewTitle: "Sáng tạo không gian",
        interiorViewDesc: "Tải ảnh 1 không gian nội thất lên AI sẽ sáng tạo 9 không gian khác nhau cùng style với không gian gốc",
        architectureViewTitle: "Sáng tạo kiến trúc",
        architectureViewDesc: "Tải ảnh kiến trúc lên Ai sẽ tạo 9 góc camera khác nhau từ ảnh đó",
        archToInteriorTitle: "Nội thất từ Kiến trúc",
        archToInteriorDesc: "Tải ảnh kiến trúc lên Ai sẽ tạo 9 góc camera nội thất khác nhau từ ảnh kiến trúc đó",
        interiorDetailTitle: "Sáng tạo nội thất",
        interiorDetailDesc: "Tải ảnh lên AI sẽ tạo 9 view cận cảnh khác nhau tập trung vào đồ nội thất, đồ rời và vật liệu, góc chụp nghệ thuật.",
        syncViewTitle: "Đồng bộ View",
        syncViewDesc: "Đồng nhất phong cách, vật liệu và ánh sáng từ ảnh mẫu sang các góc view khác.",
        lightingSimulationTitle: "Mô phỏng ánh sáng & style",
        lightingSimulationDesc: "Vẽ lại ảnh đã render theo mood ánh sáng và phong cách của ảnh tham khảo.",
        constructionProcessTitle: "Quá trình xây dựng",
        constructionProcessDesc: "Tái hiện các giai đoạn xây dựng từ hiện trạng thô đến hoàn thiện sân vườn từ ảnh thực tế.",
        canvaMixTitle: "Canva Mix",
        canvaMixDesc: "Ghép đồ nội thất và trang trí vào không gian with tỉ lệ và ánh sáng thực tế.",
        vr360Title: "VR 360",
        vr360Desc: "Tạo không gian 360 độ từ mô tả hoặc tải ảnh Panorama lên để tham quan thực tế ảo.",
        vr360ViewTitle: "Không gian 360 của bạn",
        vr360ViewDesc: "Kéo chuột để khám phá không gian xung quanh.",
        uploadVrImage: "Tải ảnh Panorama 360",
        vr360PromptLabel: "Mô tả không gian 360",
        generateVrButton: "Tạo VR 360",
        comingSoon: "Sắp ra mắt",
        backToUtilities: "Quay lại Tiện ích",
        uploadInspirationImage: "1. Tải ảnh nguồn cảm hứng",
        uploadReferenceImage: "2. Tải ảnh tham chiếu (Style)",
        moodboardPromptHelp: "3. Mô tả chủ đề hoặc phong cách",
        moodboardReferenceHelp: "AI sẽ lấy cảm hứng về màu sắc và phong cách từ ảnh này.",
        moodboardImageCount: "4. Số lượng kết quả",
        generateMoodboardButton: "Tạo Moodboard",
        moodboardEmptyHeader: "Bảng cảm hứng của bạn",
        moodboardEmptyText: "Tải ảnh và nhập mô tả để bắt đầu.",
        generatingMoodboard: "Đang tạo moodboard...",
        moodboardSamplePrompt: "Sử dụng prompt mẫu",
        moodboardSamplePromptText: "tạo ảnh moodboard đò rời nội thất, tách riêng từng đồ rời with nền trắng, sẽ có 1 ảnh tổng thể ở trung tâm, bên dưới sẽ là các đồ rời tách riêng (gường, tab đầu giường, tủ quảng áo, đèn, thảm, rèm), bên phải là bảng màu và vật liệu, tất cả nằm gọn trong 1 khung dọc còn lại là nền trắng",
        uploadModelImage: "1. Tải ảnh mô hình",
        chooseLighting: "2. Chọn loại ánh sáng",
        interiorLighting: "Ánh sáng Nội thất",
        exteriorLighting: "Ánh sáng Ngoại thất",
        generateLightingButton: "Tạo ảnh with ánh sáng mới",
        lightingEmptyHeader: "Không gian ánh sáng của bạn",
        lightingEmptyText: "Tải ảnh lên để bắt đầu thử nghiệm các kịch bản chiếu sáng.",
        generatingLighting: "Đang tạo ảnh mới...",
        motionRequest: "2. Yêu cầu chuyển động (tiếng Việt)",
        generatingVideoPrompt: "Đang tạo prompt video...",
        generatedVideoPromptTitle: "Prompt đã tạo (tiếng Anh)",
        videoPromptEmptyHeader: "Kịch bản Video của bạn",
        videoPromptEmptyText: "Tải ảnh lên và nhập yêu cầu để AI tạo ra một prompt video chuyên nghiệp.",
        uploadImageToExtend: "1. Tải ảnh cần mở rộng",
        chooseAspectRatio: "2. Chọn tỉ lệ khung hình mới",
        generateExtendedView: "Mở rộng View",
        generatingExtendedView: "Đang mở rộng view...",
        extendViewEmptyHeader: "Không gian mở rộng của bạn",
        extendViewEmptyText: "Tải ảnh lên và chọn tỉ lệ để bắt đầu.",
        uploadImageForStyleChange: "1. Tải ảnh cần thay đổi style",
        enterStyleRequest: "2. Nhập yêu cầu về phong cách",
        styleRequestPlaceholder: "Ví dụ: phong cách Indochine, phong cách cyberpunk, tông màu ấm áp...",
        generateNewPromptButton: "Tạo Prompt Mới",
        generatedPromptReady: "3. Prompt đã sẵn sàng! (Có thể chỉnh sửa)",
        generateStyledImageButton: "Tạo ảnh with Style mới",
        generatingStylePrompt: "Đang tạo prompt mới...",
        generatingStyledImages: "Đang tạo ảnh theo style mới...",
        interiorViewStep1: "1. Tải ảnh nội thất mẫu",
        interiorViewStep1Desc: "Tải 1 ảnh có style, vật liệu và màu sắc bạn muốn nhân bản.",
        interiorViewStep2: "2. Tải ảnh nhân vật (Tùy chọn)",
        interiorViewStep2Desc: "Nếu tải lên, nhân vật này sẽ xuất hiện trong các không gian.",
        interiorViewStep3: "3. Bắt đầu sáng tạo",
        interiorViewStep3Desc: "AI sẽ tạo ra 9 không gian đồng nhất.",
        architectureViewStep1: "1. Tải ảnh kiến trúc mẫu",
        architectureViewStep1Desc: "Tải 1 ảnh có hình khối cơ bản hoặc style bạn muốn phát triển.",
        architectureViewStep2: "2. Tải ảnh nhân vật (Tùy chọn)",
        architectureViewStep2Desc: "Nếu tải lên, nhân vật này sẽ xuất hiện trong các phương án.",
        architectureViewStep3: "3. Bắt đầu sáng tạo",
        architectureViewStep3Desc: "AI sẽ tạo ra 9 phương án kiến trúc khác nhau.",
        archToInteriorStep1: "1. Tải ảnh Kiến trúc (Ngoại thất)",
        archToInteriorStep1Desc: "Tải ảnh mặt tiền hoặc phối cảnh công trình. AI sẽ tự thiết kế nội thất tương ứng.",
        archToInteriorStep2: "2. Tải ảnh nhân vật (Tùy chọn)",
        archToInteriorStep2Desc: "Nhân vật sẽ được đưa vào các không gian nội thất.",
        archToInteriorStep3: "3. Sáng tạo nội thất",
        archToInteriorStep3Desc: "AI tạo 9 không gian: phòng khách, bếp, ngủ... đồng nhất phong cách kiến trúc.",
        syncViewStep1: "1. Tải ảnh View Mẫu",
        syncViewStep1Desc: "Tải 1 ảnh đã render đẹp để AI ghi nhớ style, vật liệu và ánh sáng.",
        syncViewStep2: "2. Tải ảnh View Cần Đồng Bộ",
        syncViewStep2Desc: "Tải ảnh phác thảo hoặc render thô ở góc máy khác.",
        syncViewStep3: "3. Bắt đầu đồng bộ",
        syncViewStep3Desc: "AI sẽ vẽ lại view thứ 2 theo đúng style của view 1.",
        lightingSimulationStep1: "1. Tải ảnh đã render",
        lightingSimulationStep1Desc: "Tải ảnh render hiện tại bạn muốn thay đổi mood and style.",
        lightingSimulationStep2: "2. Tải ảnh Ánh sáng Tham khảo",
        lightingSimulationStep2Desc: "Tải ảnh có mood ánh sáng và phong cách diễn họa mong muốn.",
        lightingSimulationStep3: "3. Mô phỏng ánh sáng",
        lightingSimulationStep3Desc: "AI sẽ render lại ảnh 1 theo đúng kịch bản của ảnh 2.",
        constructionStep1: "1. Tải ảnh công trình đã hoàn thiện",
        constructionStep1Desc: "Tải ảnh phối cảnh hoặc thực tế của công trình để AI tính toán các giai đoạn trước đó.",
        constructionStep2: "2. Bắt đầu mô phỏng",
        constructionStep2Desc: "AI sẽ tạo ra 5 bức ảnh tương ứng với 5 giai đoạn thi công chính.",
        stageMessy: "Hiện trạng bừa bãi",
        stageCleaned: "Hiện trạng dọn sạch",
        stageRough: "Xây thô (Chưa sơn)",
        stageFinishing: "Hoàn thiện (Sơn & Cửa)",
        stageLandscape: "Hoàn thiện sân vườn",
        stageFinal: "Hoàn thiện thực tế",
        convertToWatercolor: "Sketch màu nước",
        convertingToWatercolor: "Đang chuyển sang Sketch màu nước...",
        generatingConstructionViews: "Đang tính toán các giai đoạn xây dựng...",
        generatingArchitectureViews: "Đang phân tích và tạo các phương án kiến trúc...",
        generatingArchitectureOption: "Đang tạo {0}...",
        downloadAll: "Tải xuống tất cả",
        roomLiving: "Phòng khách",
        roomBedroom: "Phòng ngủ",
        roomKitchen: "Phòng bếp",
        roomDining: "Phòng ăn",
        roomStudy: "Phòng đọc",
        roomBath: "Phòng tắm",
        roomHall: "Hành lang",
        roomDetail: "Góc cận cảnh",
        roomOutdoor: "Ban công / Sân vườn",
        archOption: "Phương án",
        archViewTypes: {
            wide1: "Toàn cảnh 1 (Bình minh)",
            wide2: "Toàn cảnh 2 (Hoàng hôn)",
            wide3: "Toàn cảnh 3 (Góc chim bay)",
            close1: "Cận cảnh 1 (Vật liệu bề mặt)",
            close2: "Cận cảnh 2 (Chi tiết cấu tạo)",
            close3: "Cận cảnh 3 (Lối vào & Sảnh)",
            close4: "Cận cảnh 4 (Góc kiến trúc)",
            artistic1: "Nghệ thuật 1 (Xóa phông tiền cảnh)",
            artistic2: "Nghệ thuật 2 (Phối cảnh đêm)"
        },
        interiorDetailViewTypes: {
            detail1: "Cận cảnh Sofa & Vải",
            detail2: "Cận cảnh Bàn & Decor",
            detail3: "Cận cảnh Đèn & Ánh sáng",
            detail4: "Chi tiết Gỗ & Vân đá",
            detail5: "Chi tiết Kim loại & Khớp nối",
            detail6: "Góc Decor nghệ thuật",
            artistic1: "Xóa phông (Bokeh)",
            artistic2: "Tương phản sáng tối",
            artistic3: "Bố cục tối giản"
        },
        smartEditStep1: "1. Khoanh khung làm việc (Box)",
        smartEditStep1Desc: "Chọn vùng nhỏ quanh đối tượng để AI tập trung xử lý.",
        smartEditStep2: "2. Tô vùng cần sửa (Mask)",
        smartEditStep2Desc: "Chỉ những phần được tô đỏ mới bị thay đổi.",
        smartEditStep3: "3. Nhập mô tả",
        smartEditStep4: "4. Render & Ghép ảnh",
        confirmAreaPrompt: "Xác nhận Prompt Cận cảnh",
        editAreaPromptDesc: "AI đã phân tích vùng chọn. Bạn có thể chỉnh sửa mô tả bên dưới trước khi tạo ảnh.",
        confirmAndGenerate: "Xác nhận & Tạo ảnh",
        trendLayoutTitle: "Dàn trang bản vẽ",
        trendLayoutDesc: "Tạo bố cục kiến trúc từ ý tưởng.",
        trendModelTitle: "Tạo Bản vẽ",
        trendModelDesc: "Tạo các bản vẽ kỹ thuật chiếu vuông góc.",
        trendDiagramTitle: "Tạo Diagram",
        trendDiagramDesc: "Tạo sơ đồ phân tích kiến trúc.",
        trendAnalyzeTitle: "Phân tích hình khối",
        trendAnalyzeDesc: "Phân tích hình khối và kiến trúc từ ảnh.",
        trendMoodboardTitle: "Moodboard",
        trendMoodboardDesc: "Tạo bảng ý tưởng và vật liệu.",
        textureMapTitle: "Tạo Texture Vật liệu",
        textureMapDesc: "Tạo các kênh map (Diffuse, Normal, Displacement...) từ ảnh vật liệu để render.",
        textureMapStep1: "1. Tải ảnh vật liệu",
        textureMapStep2: "2. Crop vùng texture (Tùy chọn)",
        textureMapStep3: "3. Chọn các kênh map",
        textureMapEmptyHeader: "Texture của bạn",
        textureMapEmptyText: "Tải ảnh và chọn vùng vật liệu để bắt đầu tạo map.",
        generateMaps: "Tạo Texture Maps",
        generatingMaps: "Đang tính toán các kênh map...",
        engineeredPrompts: {
            zoomMagnifyPrompt: `Bạn là chuyên gia siêu phân giải và nhiếp ảnh kiến trúc. Nhiệm vụ: "Render cận cảnh" (Close-up) vùng ảnh được cung cấp.
**YÊU CẦU BẮT BUỘC**:
1. GIỮ NGUYÊN 100% hình khối kiến trúc, các đường nét hình học, và vị trí các chi tiết từ ảnh gốc. Không được thêm bớt hay làm sai lệch cấu trúc vật lý.
2. Tái tạo bề mặt vật liệu (texture) cực kỳ sắc nét: vân gỗ, vân đá, thớ vải, độ bóng gương, độ nhám bề mặt phải trung thực và chi tiết hơn ảnh gốc.
3. Bạn có thể thay đổi góc nhìn camera một cách tinh tế (ví dụ: góc nghiêng nghệ thuật, chụp từ dưới lên) để tạo ra một bức ảnh chụp chi tiết kiến trúc chuyên nghiệp hơn, but phải đảm bảo người xem vẫn nhận ra ngay lập tức đây là cùng một đối tượng trong ảnh gốc.
4. Ánh sáng và màu sắc phải thống nhất hoàn toàn with không gian tổng thể.
Kết quả: Ảnh chụp macro kiến trúc siêu thực, độ phân giải cao, chi tiết tuyệt đối.`,
            analyzeCharacterPrompt: "Phân tích người trong ảnh. Mô tả ngoại hình tập trung vào: tóc, da, quần áo dưới 20 từ. Chỉ xuất văn bản thô, không thêm lời dẫn.",
            analyzeAreaPrompt: `Hãy đóng vai một chuyên gia nhiép ảnh kiến trúc và AI Prompt Engineer. Nhiệm vụ của bạn là phân tích một hình ảnh (được crop từ một ảnh lớn hơn) để viết một prompt mô tả cực kỳ chi tiết cho AI tạo ảnh.
YÊU CẦU CẤU TRÚC: "góc chụp cận cảnh tập trung vào chi tiết của [đối tượng], [đặc điểm của đối tượng đó (chi tiết cụ thể, chất liệu bề mặt, vân vật liệu sắc nét, độ nhám, độ phản xạ)], [điều kiện ánh sáng và bóng đổ]".
YÊU CẦU ĐỘ DÀI: Câu trả lời phải dài từ 30 đến 50 từ tiếng Việt.
HÀNH VI: Tập trung đặc tả các chi tiết nhỏ mà ảnh gốc đang bị mờ. Mô tả các đường nét vật liệu như thể bạn đang nhìn chúng ở độ phân giải 8k. Không thêm bất kỳ lời dẫn nào (như "Đây là prompt:"), chỉ xuất ra nội dung mô tả duy nhất theo cấu trúc trên.`,
            applyLighting: `Bạn là một chuyên gia về ánh sáng và render kiến trúc. Người dùng đã cung cấp một hình ảnh và muốn thay đổi hoàn toàn kịch bản chiếu sáng của nó. Nhiệm vụ của bạn là render lại hình ảnh này with điều kiện ánh sáng mới được mô tả sau đây. **QUAN TRỌNG**: Bạn phải giữ nguyên 100% hình khối kiến trúc, vật liệu, và bố cục của hình ảnh gốc. Chỉ thay đổi ánh sáng, bóng đổ, và không khí tổng thể của cảnh. Kịch bản ánh sáng mong muốn là: "{0}".`,
            classifyImageTypePrompt: `Đây là hình ảnh nội thất hay ngoại thất? Chỉ trả lời bằng một từ duy nhất: 'interior' hoặc 'exterior'.`,
            generateInteriorVariation: `Bạn là một Kiến trúc sư nội thất chuyên nghiệp. Bạn được cung cấp một hình ảnh mẫu đại diện cho style, màu sắc và vật liệu. Nhiệm vụ của bạn là tưởng tượng và vẽ ra một không gian khác trong cùng ngôi nhà đó.
YÊU CẦU:
- GIỮ NGUYÊN Style thiết kế (ví dụ: Japandi, Industrial, Tân cổ điển...).
- GIỮ NGUYÊN Bảng màu chủ đạo (ví dụ: Gỗ óc chó + Da bò + Xám bê tông).
- GIỮ NGUYÊN Tính chất vật liệu (độ bóng, độ nhám, vân gỗ).
- KHÔNG GIAN CẦN TẠO: "{0}".
{1}
Hãy vẽ một bức ảnh chụp nhiếp ảnh kiến trúc chuyên nghiệp, thực tế, 8k, ánh sáng ban ngày tự nhiên dịu nhẹ.`,
            generateArchitectureVariation: `Bạn là một Kiến trúc sư chuyên nghiệp. Bạn được cung cấp một hình ảnh mẫu kiến trúc đại diện cho 100% hình khối và chi tiết thực tế. Nhiệm vụ của bạn là vẽ lại một view kiến trúc cụ thể (cận cảnh hoặc nghệ thuật) từ công trình này.
YÊU CẦU:
- GIỮ NGUYÊN 100% mọi chi tiết kiến trúc, hình khối, vật liệu và cấu trúc từ ảnh mẫu.
- TUYỆT ĐỐI KHÔNG vẽ thêm, không sáng tạo chi tiết mới, không thay đổi cấu kiện nếu không có trong ảnh gốc. Chỉ được phép lấy đúng những gì đang có trên công trình gốc để thể hiện.
- Đối với các view CẬN CẢNH và NGHỆ THUẬT: Bạn chỉ được phép tập trung vào những thành phần hiện hữu của công trình, không được phép nội suy hay sử dụng chi tiết lạ.
- Bạn chỉ được phép thay đổi góc máy, tiêu cự ống kính, và điều kiện ánh sáng để tạo ra bức ảnh nhiếp ảnh kiến trúc chuyên nghiệp.
- VIEW CẦN TẠO: "{0}".
{1}
Kết quả phải là một ảnh chụp thực tế, 8k, sắc nét tuyệt đối.`,
            generateArchToInterior: `Bạn là một Kiến trúc sư and Nhà thiết kế nội thất tài ba. Bạn được cung cấp một hình ảnh NGOẠI THẤT của một công trình kiến trúc. Nhiệm vụ của bạn là thiết kế and vẽ ra không gian NỘI THẤT bên trong công trình đó.
YÊU CẦU:
- PHONG CÁCH: Nội thất phải hoàn toàn đồng nhất with phong cách kiến trúc ngoại thất (ví dụ: nếu kiến trúc hiện đại tối giản thì nội thất cũng phải hiện đại tối giản).
- HỆ CỬA SỔ: Nếu không gian có cửa sổ, kiểu dáng khung cửa, vật liệu and tỷ lệ của cửa sổ PHẢI giống hệt with hệ cửa sổ thấy được ở mặt tiền kiến trúc trong ảnh gốc.
- VẬT LIỆU: Sử dụng bảng vật liệu and màu sắc tương đồng with ngoại thất để tạo sự xuyên suốt.
- KHÔNG GIAN CẦN TẠO: "{0}".
{1}
Kết quả là một bức ảnh chụp nhiếp ảnh nội thất chuyên nghiệp, 8k, ánh sáng ban ngày tự nhiên cực kỳ chân thực.`,
            generateInteriorDetailVariation: `Bạn là một chuyên gia nhiếp ảnh nội thất và Kiến trúc sư nội thất. Bạn được cung cấp một hình ảnh không gian nội thất. Nhiệm vụ của bạn là vẽ lại một view CẬN CẢNH (Close-up) hoặc NGHỆ THUẬT (Artistic) tập trung vào các chi tiết đồ rời, vật liệu hoặc decor từ không gian này.
YÊU CẦU:
- GIỮ NGUYÊN 100% phong cách, màu sắc, và tính chất vật liệu từ ảnh mẫu.
- TUYỆT ĐỐI KHÔNG vẽ thêm đồ đạc lạ không có trong ảnh gốc. Chỉ được phép đặc tả những gì đang hiện hữu.
- Tập trung vào việc thể hiện bề mặt vật liệu cực kỳ sắc nét (vân gỗ, thớ vải, độ bóng của kim loại).
- Sử dụng các kỹ thuật nhiếp ảnh chuyên nghiệp: xóa phông (bokeh), ánh sáng kịch tính, góc chụp macro.
- VIEW CẦN TẠO: "{0}".
Kết quả phải là một ảnh chụp thực tế, 8k, sắc nét tuyệt đối, mang tính nghệ thuật cao.`,
            syncViewPrompt: `Bạn là một chuyên gia Render AI chuyên nghiệp. Bạn được cung cấp 2 hình ảnh.
HÌNH ẢNH 1: Là View Mẫu (Style Reference). Bạn hãy phân tích và ghi nhớ thật kỹ: màu sắc chủ đạo, vật liệu (gỗ, đá, vải...), ánh sáng (hướng sáng, nhiệt độ màu, độ tương phản), bối cảnh (environment, cảnh quan) và phong cách thiết kế tổng thể.
HÌNH ẢNH 2: Là View Cần Đồng Bộ (Source Geometry).
NHIỆM VỤ: Render lại HÌNH ẢNH 2 sao cho:
1. GIỮ NGUYÊN 100% góc máy camera, hình khối kiến trúc, và các chi tiết hiện có trong HÌNH ẢNH 2.
2. ÁP DỤNG TOÀN BỘ màu sắc, vật liệu, kịch bản ánh sáng và không khí bối cảnh từ HÌNH ẢNH 1 vào không gian của HÌNH ẢNH 2.
Kết quả phải là một ảnh chụp thực tế, 8k, cực kỳ chân thực, thể hiện sự đồng nhất hoàn hảo về mặt thị giác with View Mẫu.`,
            lightingSimulationPrompt: `Bạn là một chuyên gia về diễn họa kiến trúc và ánh sáng. Bạn được cung cấp 2 hình ảnh.
HÌNH ẢNH 1: Là Mẫu Ánh Sáng và Style (Mood Reference). Hãy phân tích thật kỹ kịch bản chiếu sáng (lighting setup), tông màu (color grading), độ tương phản (contrast) và phong cách diễn họa (render style - ví dụ: photorealistic, sketchy, watercolor, cinematic).
HÌNH ẢNH 2: Là Phối Cảnh Hiện Có (Base Image).
NHIỆM VỤ: Vẽ lại HÌNH ẢNH 2 sao cho:
1. GIỮ NGUYÊN 100% hình khối kiến trúc, các chi tiết nội thất/kiến trúc, vật liệu (textures) và góc máy camera từ HÌNH ẢNH 2. Tuyệt đối không thêm bớt vật thể hay thay đổi vật liệu.
2. CHỈ THAY ĐỔI mood ánh sáng, tông màu và phong cách diễn họa để giống hệt HÌNH ẢNH 1.
Kết quả phải là một tác phẩm diễn họa có sự tương đồng tuyệt đối về mặt cảm xúc và phong cách trình bày với Ảnh Tham Khảo.`,
            constructionMessy: `Bạn là một AI chỉnh sửa ảnh kiến trúc. Hãy vẽ lại hình ảnh công trình này ở giai đoạn hiện trạng mặt bằng chưa xây dựng. 
YÊU CẦU:
- GIỮ NGUYÊN 100% bối cảnh xung quanh, bầu trời và góc máy camera.
- THAY THẾ vị trí của công trình chính bằng một khu đất trống bừa bãi, ngổn ngang đất đá, xà bần, gạch vụn và cỏ dại. Có thể có một vài tấm lán tạm cho công nhân.
- Tạo cảm giác một công trường chưa được dọn dẹp, hoang sơ trước khi khởi công.`,
            constructionCleaned: `Bạn là một AI chỉnh sửa ảnh kiến trúc. Hãy vẽ lại hình ảnh công trình này ở giai đoạn mặt bằng đã được dọn dẹp sạch sẽ.
YÊU CẦU:
- GIỮ NGUYÊN 100% bối cảnh xung quanh và góc máy camera.
- THAY THẾ công trình chính bằng một nền đất phẳng đã được san lấp, dọn sạch xà bần. 
- Có hàng rào tôn bao quanh công trường. Mặt bằng trông ngăn nắp, sẵn sàng để ép cọc và đào móng.`,
            constructionRough: `Bạn là một AI chỉnh sửa ảnh kiến trúc. Hãy vẽ lại công trình này ở giai đoạn XÂY THÔ.
YÊU CẦU:
- GIỮ NGUYÊN 100% hình khối kiến trúc, vị trí các ô cửa và góc máy camera.
- THAY THẾ toàn bộ bề mặt hoàn thiện bằng vật liệu THÔ: tường gạch đỏ chưa trát (naked brick walls), các cột và dầm bê tông xám lộ ra (exposed concrete beams/columns). 
- Không có sơn, không có kính cửa, không có lan can. Có thể có giàn giáo gỗ hoặc sắt bao quanh.
- Kết quả trông như một công trình đang trong giai đoạn thi công khung xương.`,
            constructionFinishing: `Bạn là một AI chỉnh sửa ảnh kiến trúc. Hãy vẽ lại công trình này ở giai đoạn HOÀN THIỆN CƠ BẢN.
YÊU CẦU:
- GIỮ NGUYÊN 100% hình khối kiến trúc và góc máy.
- CÔNG TRÌNH: Tường đã được trát phẳng và sơn màu hoàn thiện theo mẫu. Các hệ cửa nhôm kính đã được lắp đặt đầy đủ.
- NGOẠI CẢNH: Phần sân và vườn chưa có cây xanh, vẫn là nền bê tông hoặc đất trống. Chưa có cổng rào hay decor trang trí ngoại thất.
- Trông như ngôi nhà vừa mới xây xong phần xác và lắp cửa nhưng chưa làm cảnh quan.`,
            constructionLandscape: `Bạn là một AI chỉnh sửa ảnh kiến trúc. Hãy vẽ lại công trình này ở giai đoạn HOÀN THIỆN TOÀN BỘ CẢNH QUAN.
YÊU CẦU:
- GIỮ NGUYÊN công trình kiến trúc như ảnh gốc.
- THÊM TOÀN BỘ phần cảnh quan: sân lát đá, thảm cỏ xanh mướt, bồn hoa, cây bóng mát lớn, hệ thống đèn sân vườn và cổng tường rào thẩm mỹ.
- Kết quả là một bức ảnh nhiếp ảnh kiến trúc thực tế, lung linh, thể hiện công trình ở trạng thái đẹp nhất sau khi đưa vào sử dụng.`,
            watercolorSketchPrompt: `Bạn là một họa sĩ diễn họa kiến trúc bậc thầy. Hãy chuyển đổi hình ảnh này thành một bức phác thảo màu nước (watercolor sketch) vẽ tay chuyên nghiệp. 
YÊU CẦU BẮT BUỘC: 
1. GIỮ NGUYÊN 100% hình khối, tỷ lệ và chi tiết kiến trúc từ ảnh gốc. Không được biến dạng hay thêm bớt cấu trúc vật lý.
2. GIỮ NGUYÊN bảng màu gốc của công trình và bối cảnh.
3. THỂ HIỆN bằng những nét vẽ bút chì/bút mực tay sắc sảo kết hợp hiệu ứng loang màu nước nghệ thuật trên nền giấy textured. 
Kết quả là một tác phẩm nghệ thuật sketch kiến trúc siêu thực, đầy cảm xúc và sang trọng.`,
            interiorViewWithCharacter: "THÊM NHÂN VẬT: Hãy đưa nhân vật trong ảnh thứ hai vào không gian một cách tự nhiên. Nhân vật nên {action}. Đảm bảo trang phục and ngoại hình của nhân vật thống nhất with ảnh nhân vật được cung cấp.",
            architectureViewWithCharacter: "THÊM NHÂN VẬT: Hãy đưa nhân vật trong ảnh thứ hai vào bối cảnh kiến trúc một cách tự nhiên (ví dụ: đang đi bộ trước sảnh, đứng ở ban công, hoặc đi dạo trong sân vườn). Đảm bảo trang phục and ngoại hình thống nhất with ảnh nhân vật.",
            generateFromImageInterior: `Hãy đóng vai một chuyên gia thiết kế nội thất with 20 năm kinh nghiệm and chuyên gia dựng hình 3D. Từ ảnh 3D/phác thảo được cung cấp, hãy viết một prompt chi tiết dưới 100 từ theo cấu trúc sau, bổ sung yếu tố điện ảnh/nhiếp ảnh:
- Ảnh chụp thực tế của [phòng], phong cách thiết kế, mô tả kỹ về vật liệu, tính chất vật liệu của đối tượng chính.
- Ánh sáng: Mô tả rõ ràng về ánh sáng (ví dụ: Ánh sáng Volumetric God Rays, Golden Hour, Ánh sáng Low-Key), góc máy (Wide Shot, Low Angle).
- hãy lựa chọn ánh sáng làm sao để kết quả ảnh đầu ra giống ảnh chụp thực tế nhất.
- Mô tả góc camera đúng with góc camera ảnh tải lên.

Câu lệnh mẫu: Ảnh chụp thực tế của phòng khách, phong cách hiện đại sang trọng. Vật liệu hiển thị rõ nét: sofa vải nỉ dệt thô có độ xù bề mặt, bàn đá Marble trắng vân mây bóng mờ, sàn gỗ óc chó lát xương cá ấm áp. Ánh sáng tự nhiên (Soft Daylight) chiếu xiên tạo hiệu ứng Volumetric nhẹ, làm nổi bật hạt bụi không khí and texture vật liệu. Ánh sáng Fill Light dịu nhẹ làm sáng vùng tối. Góc máy Wide Shot 24mm, Eye-Level, góc nhìn chính diện bao quát không gian. Ảnh 8k, phong cách nhiếp ảnh kiến trúc, siêu thực.

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.`,
            generateFromKeywordsInterior: `Hãy đóng vai một chuyên gia thiết kế nội thất and dựng hình 3D. Từ các từ khóa do người dùng cung cấp về một không gian nội thất, hãy viết một prompt chi tiết dưới 100 từ, tập trung vào các yếu tố sau:
- Phong cách thiết kế dựa trên từ khóa.
- Mô tả chi tiết, nhấn mạnh vào sự chân thực của vật liệu (ví dụ: vân gỗ sồi tự nhiên, bề mặt đá marble bóng mờ, vải sofa có độ sần nhẹ).
- Ánh sáng: Luôn là ánh sáng ban ngày tự nhiên, dịu nhẹ, chiếu qua cửa sổ, tạo cảm giác mềm mại, không có bóng đổ gắt.
- Mô tả một góc camera phù hợp.
- Cấm kỵ: Tuyệt đối không mô tả bối cảnh bên ngoài (ví dụ: view nhìn ra thành phố, sân vườn...).

Từ khóa của người dùng: "{0}"

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.`,
            generateWithReference: `Prompt của người dùng là: "{0}". Với vai trò là một AI render kiến trúc, nhiệm vụ của bạn là kết hợp một bản phác thảo cấu trúc with một ảnh tham chiếu phong cách. Ảnh đầu tiên là bản phác thảo cấu trúc. Ảnh thứ hai là ảnh tham chiếu về phong cách, ánh sáng, bối cảnh and vật liệu. Bạn phải áp dụng không khí, ánh sáng, bảng màu, vật liệu and cảnh quan xung quanh từ ảnh thứ hai vào công trình từ bản phác thảo đầu tiên. Nghiêm cấm sao chép hình dạng kiến trúc chính từ ảnh tham chiếu phong cách thứ hai, nhưng bạn nên áp dụng môi trường tổng thể and kết cấu của nó. Kết quả render cuối cùng phải là một ảnh ngoại thất dựa trên prompt của người dùng.`,
            generateWithReferenceNegative: `Prompt của người dùng là: "{0}". Với vai trò là một AI render kiến trúc, nhiệm vụ của bạn là kết hợp một bản phác thảo cấu trúc with một ảnh tham chiếu phong cách. Ảnh đầu tiên là bản phác thảo cấu trúc. Ảnh thứ hai là ảnh tham chiếu về phong cách, ánh sáng, bối cảnh and vật liệu. Bạn phải áp dụng không khí, ánh sáng, bảng màu, vật liệu and cảnh quan xung quanh từ ảnh thứ hai vào công trình từ bản phác thảo đầu tiên. Nghiêm cấm sao chép hình dạng kiến trúc chính từ ảnh tham chiếu phong cách thứ hai, nhưng bạn nên áp dụng môi trường tổng thể and kết cấu của nó. Kết quả render cuối cùng phải là một ảnh ngoại thất dựa trên prompt của người dùng. QUAN TRỌNG: Người dùng đã chỉ định những điều cần TRÁNH. Bạn tuyệt đối KHÔNG ĐƯỢỢC bao gồm bất kỳ yếu tố nào sau đây trong hình ảnh: "{1}".`,
            generateWithoutReference: `Prompt của người dùng là: "{0}". Bạn đang tạo một bản render kiến trúc thực tế. Hình ảnh được cung cấp là điểm tham chiếu tuyệt đối về hình khối và chi tiết (không được coi là phác thảo). Hãy tạo ra một hình ảnh chân thực dựa trên bản gốc này and prompt của người dùng.`,
            generateWithoutReferenceNegative: `Prompt của người dùng là: "{0}". Bạn đang tạo một bản render kiến trúc thực tế. Hình ảnh được cung cấp là điểm tham chiếu tuyệt đối về hình khối và chi tiết (không được coi là phác thảo). Hãy tạo ra một hình ảnh chân thực dựa trên bản gốc này and prompt của người dùng. QUAN TRỌNG: Người dùng đã chỉ định những điều cần TRÁNH. Bạn tuyệt đối KHÔNG ĐƯỢC bao gồm bất kỳ yếu tố nào sau đây trong hình ảnh: "{1}".`,
            generateFromImage: `(Vai trò:
bạn là một chuyên gia thiết kế nội thất và kiến trúc với 20 năm kinh nghiệm đồng thời bạn còn là 1 chuyên gia tạo ảnh bằng AI trong lĩnh vực kiến trúc và nội thất.

Kỹ năng:
- Bạn am hiểu về các kỹ thuật chụp ảnh kiến trúc nội thất cảnh quan.
- Am hiểu về bố cục, ánh sáng, góc camera
- Nghiên cứu sâu các kỹ thuật viết Prompt tạo ảnh bằng gemini

Nhiệm vụ:
Từ ảnh 3D/phác thảo được cung cấp, hãy viết một prompt chi tiết dưới 150 từ theo cấu trúc sau, bổ sung yếu tố điện ảnh/nhiếp ảnh:
Ảnh chụp thực tế của [dạng công trình], phong cách thiết kế, mô tả kỹ về hình khối, vật liệu, tính chất vật liệu của đối tượng chính, bối ảnh phù hợp, ánh sáng, góc camera và chỉ số máy ảnh phù hợp.

Quy định:
- Hình khối , vật liệu, tính chất phải mô tả đúng với ảnh tải lên không được sáng tạo sai.
- Bối cảnh sáng tạo 1 bối cảnh phù hợp với công trình và ưu tiên các bối cảnh ở việt nam.
- ánh sáng lựa chọn 1 thời điểm ánh sáng phù hợp và làm nổi bật công trình kèm mood.
- góc camera: góc camera dựa theo ảnh tải lên
- mô tả ánh sáng và bối cảnh để ảnh kết quả giống với chụp thực tế ở việt nam nhất và tuyệt đối không có dây điện biển bảng quảng cáo.

Ví dụ:
"Ảnh chụp kiến trúc thực tế của biệt thự Tân Cổ Điển.
Mái ngói đen nhám, hệ lam gỗ dọc tinh tế, tường ốp đá chẻ thô mộc và ban công tràn ngập cây xanh nhiệt đới.

Bối cảnh khu phố yên tĩnh ở Việt Nam, sạch sẽ, đường nhựa phẳng, vỉa hè lát đá tối màu, không có người, không dây điện rối.Hai bên trồng cây bụi nhiệt đới dày lá to xanh đậm chạy ngang, kết hợp chuối cảnh/cau/cọ.

ánh sáng:Ánh nắng ban ngày lúc 10h sáng, trời xanh trong, bóng đổ của cây và lam tạo pattern rõ trên tường nhưng mềm vừa, tổng thể sang – sạch – yên bình.

Góc máy Wide Shot, thể hiện góc nhìn từ dưới lên."
Prompt ví dụ chỉ mang tính chất tham khảo về cấu trúc chứ không phải dựa theo y hệt.

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.và sau prompt có thêm cụm: giữ nguyên chi tiết gốc ảnh tải lên).`,
            generateFromKeywords: `Hãy đóng vai một chuyên gia thiết kế nội thất and kiến trúc with 20 năm kinh nghiệm and chuyên gia dựng hình 3D. Từ các từ khóa do người dùng cung cấp, hãy viết một prompt chi tiết dưới 100 từ theo cấu trúc sau, bổ sung yếu tố điện ảnh/nhiếp ảnh:
- Ảnh chụp thực tế của [dạng công trình], phong cách thiết kế, mô tả kỹ về vật liệu, tính chất vật liệu của đối tượng chính.
- Tự sáng tạo bao cảnh and bối cảnh cho phù hợp dựa trên các từ khóa.
- Ánh sáng: Mô tả rõ ràng về ánh sáng (ví dụ: Ánh sáng Volumetric God Rays, Golden Hour, Ánh sáng Low-Key), góc máy (Wide Shot, Low Angle), and độ sâu trường ảnh (Depth of Field).
- Ưu tiên các bối cảnh ở Việt Nam, hãy lựa chọn bối cảnh and ánh sáng làm sao để kết quả ảnh đầu ra có bối cảnh and ánh sáng giống ảnh chụp thực tế ở Việt Nam nhất.
- Mô tả một góc camera phù hợp.

Từ khóa của người dùng: "{0}"

Ví dụ: Nếu người dùng nhập "biệt thự tân cổ điển, sài gòn", bạn có thể viết: "Ảnh chụp kiến trúc thực tế của biệt thự Tân Cổ Điển. Tường thạch cao màu cream, ban công sắt mỹ thuật đen. Bối cảnh: Đường phố nội đô Sài Gòn, có dây điện/cáp treo and cây xanh đô thị. Ánh sáng mặt trời 10 giờ sáng (ánh nắng gắt, cường độ cao) chiếu thẳng từ trên cao, tạo bóng đổ sắc nét. Góc máy Wide Shot, thể hiện góc nhìn từ dưới lên."

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.`,
            editWithReference: `**CRITICAL INPAINTING DIRECTIVE WITH STYLE REFERENCE**
You are provided with 3 inputs: Original Image, Mask (White=Edit), and Style Reference.
Task: Completely replace content in the White masked area to match the user request: "{0}".
- Use the Style Reference for materials/lighting/vibe.
- PRESERVE the Black masked area exactly.
- Ensure seamless blending.`,
            editWithoutReference: `**INPAINTING GENERATION**
Input: Original Image + Mask (White = Edit, Black = Keep).
Task: Completely replace the content in the White masked area to match this description: "{0}".
Constraints:
- The Black area must be preserved 100%.
- The new content must fit the perspective and lighting of the original image.
- Make it realistic and high quality.`,
            smartEditPrompt: `**SMART LOCALIZED INPAINTING**
Bạn đang làm việc trên một vùng ảnh crop độ phân giải cao. Nhiệm vụ của bạn là vẽ lại phần được tô MASK (màu trắng) một cách cực kỳ chi tiết and chân thực theo mô tả: "{0}".
YÊU CẦU:
- Chỉ thay đổi những gì nằm trong vùng MASK.
- Giữ nguyên bố cục and phối cảnh của phần ảnh xung quanh trong khung crop.
- Kết quả phải hòa hợp hoàn hảo with ánh sáng and vật liệu hiện có.
- Độ chi tiết cực cao, sắc nét từng pixel.`,
            materialReplacementPrompt: `**CHỈ THỊ QUAN TRỌNG VỀ THAY THẾ VẬT LIỆU**
Bạn là một chuyên gia dựng hình kiến trúc và chuyên gia về vật liệu.
NHIỆM VỤ: Thay thế vật liệu trong vùng được tô mặt nạ đỏ của Ảnh 1 bằng vật liệu từ Ảnh 2 làm cơ sở.

**YÊU CẦU BẮT BUỘC VỀ KÍCH THƯỚC VÀ TỈ LỆ**:
1. **ĐỘ CHÍNH XÁC TUYỆT ĐỐI VỀ KÍCH THƯỚC LÁT**: Người dùng đã chọn kích thước: "{0}". Bạn PHẢI dựng các viên gạch/tấm vật liệu với đúng tỉ lệ này so với các yếu tố kiến trúc trong cảnh. Nếu kích thước là 60x60cm, hãy đảm bảo lưới gạch hoàn toàn vuông vức và có kích thước thực tế chính xác trên tường/sàn.
2. **TUÂN THỦ NGHIÊM NGẶT TỈ LỆ (SCALE)**: Người dùng đã chỉ định hệ số tỉ lệ: "{1}". Hệ số này PHẢI được áp dụng cho vân vật liệu. Tỉ lệ 1.0x là kích thước tiêu chuẩn; 0.5x nghĩa là vân/gạch nhỏ đi gấp đôi (nhiều gạch hơn); 2.0x nghĩa là vân/gạch lớn lên gấp đôi (ít gạch hơn).
3. **ĐỘ CHÍNH XÁC CỦA KIỂU LÁT**: Nếu có kiểu lát được chỉ định ("{2}"), hãy áp dụng nó với sự hoàn hảo về hình học (ví dụ: Xương cá, Chữ công).
4. **TÍNH CHẤT VẬT LIỆU**: Áp dụng tính chất được chỉ định ("{3}") với độ phản xạ và độ nhám bề mặt chân thực cao (ví dụ: Bóng, Mờ, Nhám).
5. **GIỮ NGUYÊN HÌNH KHỐI**: Giữ nguyên 100% hình khối kiến trúc và ánh sáng từ Ảnh 1. Chỉ thay đổi vật liệu bề mặt bên trong vùng chọn.

**MÔ TẢ VẬT LIỆU**: {4}

Kết quả: Một bức ảnh kiến trúc 8k siêu thực với kích thước gạch và tỉ lệ vật liệu chính xác về mặt toán học.`,
            placeAndRenderFurniture: `
**CRITICAL PHOTOREALISTIC COMPOSITION TASK: ABSOLUTE SCALE PRESERVATION**

You are a master AI of optical art and photorealistic composition. Your task is to seamlessly integrate one or more objects into a background image while STRICTLY ADHERING to the user's layout.

**Inputs:**
1.  **Background Image**: The main scene.
2.  **Object(s) Image(s)**: Subsequent PNG images (with transparency) to be placed into the background.
3.  **Placement Data (JSON)**: Contains the non-negotiable coordinates, scale, and rotation.

**MANDATORY REQUIREMENTS (FAIL IF IGNORED):**
1.  **STRICT COORDINATES & SCALE**: You MUST place the center of each object exactly at the provided \`pos\` coordinates. You MUST render the object at the exact \`scale\` (percentage of background width) specified. DO NOT "intelligently" resize or move objects. The user's placement is the absolute ground truth.
2.  **PHOTOREALISTIC HARMONIZATION**: While scale/pos are fixed, you must adjust the LIGHTING, SHADOWS, and REFLECTIONS to make the object look like it truly exists in the scene.
    - Match the background's light source direction and temperature.
    - Cast soft, realistic contact shadows on the floor/surfaces below the objects.
    - Ensure the object receives environmental reflections from the background.
3.  **EDGE BLENDING**: Perform pixel-perfect blending at the edges of the objects to remove any traces of "pasting" or "cut-out" appearance. Ensure consistent grain and sharpness.
4.  **PERSPECTIVE WARPING**: You may subtly warp the object's geometry to match the background's vanishing points, but ONLY if it does not change the perceived 2D position or footprint scale set by the user.

**Placement Data:**
\`\`\`json
{0}
\`\`\`
`,
            generateArchitecturalPrompts: `Đóng vai một nhiếp ảnh gia chuyên nghiệp with hơn 20 năm kinh nghiệm trong lĩnh vực chụp ảnh kiến trúc, nội thất, cảnh quan, quy hoạch and resort, từng đạt nhiều giải thưởng nhiếp ảnh quốc tế.

Bạn đồng thời là một chuyên gia Prompt Engineer & AI Visual Prompt Designer, am hiểu sâu về ngôn ngữ mô tả hình ảnh, bố cục thị giác, ánh sáng, không gian, tỷ lệ and cảm xúc hình ảnh trong các tạp chí kiến trúc hàng đầu thế giới như ArchDaily, Dezeen, Architectural Digest, Wallpaper, Dwell…

Tôi sẽ tải lên một hình ảnh công trình (kiến trúc hoặc nội thất). Hãy tưởng tượng bạn đang thật sự đứng trong không gian đó with chiếc máy ảnh chuyên dụng (Canon R5 hoặc Nikon Z9, ống kính tilt-shift and ống kính góc rộng – tele tuỳ cảnh).

INPUT PHỤ (Tùy chọn): Mô tả nhân vật: {0}.
YÊU CẦU: Nếu có mô tả nhân vật, hãy thay thế các từ chung chung như "người", "con người" trong các nhóm (2) Trung cảnh and (4) Nghệ thuật bằng mô tả cụ thể này.

Dựa trên kinh nghiệm nhiếp ảnh quốc tế and phong cách hình ảnh của các tạp chí kiến trúc đương đại, hãy phân tích hình ảnh được tải lên, rồi đề xuất cho tôi 20 góc chụp nghệ thuật ấn tượng nhất của công trình này.

Mỗi góc chụp được viết dưới dạng prompt tạo ảnh cho AI Nano Banana, mô tả cụ thể về góc máy, ánh sáng, thời tiết, bố cục, ống kính, cảm xúc hình ảnh, không viết dưới dạng JSON.

Phân chia rõ 4 nhóm góc cơ bản như sau:

1️⃣ 5 góc toàn cảnh (wide shots)
• Diễn tả tổng thể công trình and cảnh quan xung quanh.
• Mỗi góc nên có hiệu ứng ánh sáng and thời tiết khác nhau: bình minh, buổi trưa, hoàng hôn, đêm, trời mưa hoặc sương sớm.
• Nêu rõ hướng sáng, góc chụp (ví dụ: chụp từ trên cao, ngang tầm mắt, chéo góc 45 độ, từ phía lối vào…).

2️⃣ 5 góc trung cảnh (medium shots)
• Tập trung vào mối quan hệ giữa không gian and con người. Mỗi góc chụp PHẢI có yếu tố con người trong đó (ví dụ: một người đang đọc sách, đi dạo, hoặc tương tác with không gian).
• Mô tả bố cục, chiều sâu, phối cảnh ánh sáng, chất liệu, bóng đổ, tương phản.
• Bắt buộc: Người trong ảnh phải đang hoạt động ở BÊN TRONG công trình (ví dụ: trong phòng khách, sảnh, hành lang, ban công...), không được đứng ở ngoài đường hay xa công trình.

3️⃣ 5 góc chụp cận cảnh chi tiết (detailed close-up shots)
• Tập trung vào chi tiết vật liệu, cấu tạo kiến trúc nghệ thuật và những điểm nhấn kiến trúc tinh xảo.
• Có thể là các chi tiết tay nắm cửa, vân gỗ, các khớp nối kim loại, hoặc hiệu ứng ánh sáng trên bề mặt vật liệu đặc biệt.

4️⃣ 5 góc máy nghệ thuật (artistic shots)
• Lấy nét vào các đối tượng chính như người (sử dụng mô tả nhân vật nếu có), lá cây, bird, xe cộ. Đối tượng lấy nét sẽ chiếm tỉ lệ lớn trong khung hình. Công trình chính sẽ bị làm mờ (blur) ở phía sau, tạo hiệu ứng chiều sâu (foreground – background tách biệt).

🔴 YÊU CẦU BỔ SUNG NẾU LÀ RESORT/QUY HOẠCH:
Nếu bạn phân tích thấy bức ảnh là Tổng mặt bằng quy hoạch (Masterplan) hoặc Phối cảnh tổng thể Resort/Khu đô thị, BẮT BUỘC thêm nhóm thứ 5:

5️⃣ 5 Mô tả chi tiết công trình đơn lẻ (Specific Structure Prompts)
• Từ tổng thể quy hoạch, hãy trích xuất and tưởng tượng ra kiến trúc chi tiết của 5 hạng mục công trình quan trọng nhất (Ví dụ: Biệt thự điển hình, Clubhouse, Nhà hàng, Cổng chào, Khu tiện ích...).
• Viết prompt để render ra view cận cảnh của riêng công trình đó.
• Mô tả rõ: Kiến trúc, vật liệu, mood, and cảnh quan sát quanh nó.

Yêu cầu chi tiết cho mỗi góc chụp:
• Viết bằng tiếng Việt mô tả ngắn gọn, súc tích, gợi hình mạnh.
• Không dùng định dạng JSON, chỉ mô tả text.
• Ưu tiên dùng ngôn ngữ cảm xúc, thị giác and kỹ thuật nhiếp ảnh (ví dụ: ánh sáng xiên, khung hình dẫn mắt, tiền cảnh mờ, hậu cảnh sâu, góc ống kính tilt-shift, dynamic composition, depth of field, cinematic tone…).
• Mục tiêu: tái hiện cảm xúc, ánh sáng and nghệ thuật nhiếp ảnh chân thực nhất – giúp AI Nano Banana tạo ra hình ảnh sống động, có chiều sâu, mang phong cách nhiếp ảnh chuyên nghiệp and tạp chí quốc tế.
Quan trọng: Chỉ trả về các nhóm góc chụp như đã yêu cầu. Không thêm bất kỳ lời dẫn, giới thiệu, hay kết luận nào.`,
            generateFromPlan: `Từ giờ, bạn hãy đóng vai một chuyên gia thiết kế nội thất đồng thời là chuyên gia viết prompt tạo ảnh cho các AI tạo hình (như Midjourney, DALL-E, v.v.). Bạn có kỹ năng chuyên sâu về bố cục, hình khối, and phân tích mặt bằng kiến trúc.

Nhiệm vụ của bạn là:

Tự nhận định loại phòng dựa trên mặt bằng tôi tải lên (ví dụ: Phòng Khách, Phòng Ngủ Master, Bếp & Phòng Ăn).

Phân tích mặt bằng để xác định vị liệu đồ đạc chính (giường, sofa, tủ, bàn ăn, bếp, v.v.) and góc nhìn chính diện tiêu chuẩn.

Viết prompt tạo ảnh (bằng tiếng Việt) theo format nghiêm ngặt sau:

Góc nhìn: Luôn là góc nhìn chính diện (trực diện), không mô tả hướng nhìn camera phức tạp (ví dụ: không dùng "nhìn từ dưới lên").

Nội dung: Mô tả vị trí and loại đồ đạc có trong khung hình theo góc nhìn chính diện.

Cấm kỵ: Tuyệt đối không mô tả màu sắc, vật liệu, chất liệu. Không mô tả đồ vật nằm ngoài khung hình chính diện (ví dụ: trong phòng ngủ nhìn đầu giường thì không mô tả kệ TV).

Format đầu ra: Chỉ hiển thị duy nhất prompt đã hoàn chỉnh, bắt đầu bằng cụm từ:

Tạo phối cảnh nội thất view nhìn chính diện của không gian mặt bằng. Đó là [Loại phòng bạn đã nhận định]. View nhìn trực diện vào... [Mô tả chi tiết vị trí đồ đạc]. Sử dụng hình moodboard làm tham chiếu cho phối cảnh nội thất này. Hãy làm cho nó chân thực như một hình ảnh trực quan kiến trúc with các kết cấu and chi tiết cụ thể.

không được hiển thị phần phân tích chỉ được hiển thị phần Prompt`,
            analyzePlanStyle: `Bạn là một chuyên gia diễn họa mặt bằng nội thất cho các căn hộ bds dạng đổ màu mặt bằng, mặt bằng 3d, và view mặt bằng cắt nóc. Bạn am hiểu về chuyên sâu về viết prompt tạo ảnh cho AI Gemini.

Nhiệm vụ: Khi tôi tải 1 ảnh mặt bằng lên, bạn hãy phân tích style thể hiện, màu sắc, ánh sáng của mặt bằng đó.

Lưu ý quan trọng: Bạn phải nhận diện đúng style thể hiện là:
- Mặt bằng 2D đổ màu kỹ thuật.
- Mặt bằng 3D nhìn từ trên xuống (top-down view).
- Ảnh chụp thực tế không gian nội thất từ trên cao.
- View mặt bằng cắt nóc (3D cutaway).

Mục tiêu: Viết một đoạn prompt chuyên dụng bằng tiếng Việt để tôi có thể dùng Prompt đó tạo ảnh từ một ảnh mặt bằng 2D đầu vào sao cho kết quả ra đúng style, màu sắc và ánh sáng của ảnh mẫu bạn vừa phân tích. 

Yêu cầu output: 
- Kết quả bằng tiếng Việt.
- Prompt chuyên dụng cho AI Nano Banana (Gemini 2.5 Flash).
- Câu lệnh phải mang tính tổng quát để có thể áp dụng cho nhiều mặt bằng khác nhau nhưng vẫn giữ đúng style mẫu.
- KHÔNG hiển thị phân tích, KHÔNG lời dẫn, CHỈ hiển thị duy nhất nội dung Prompt.`,
            generateMoodboard: "Với vai trò là một nhà thiết kế nội thất chuyên nghiệp, hãy dựa vào hình ảnh and chủ đề do người dùng cung cấp: '{0}'. Nhiệm vụ của bạn là tạo ra một moodboard đẹp mắt. Moodboard phải bao gồm: một bảng màu được trích xuất từ hình ảnh, các hình ảnh truyền cảm hứng phù hợp with chủ đề, các mẫu vật liệu (vải, gỗ, kim loại), and các từ khóa liên quan. Sắp xếp các yếu tố này trong một bố cục sạch sẽ, hiện đại. Đầu ra cuối cùng phải là một hình ảnh moodboard duy nhất, gắn kết.",
            generateMoodboardWithReference: "Với vai trò là một nhà thiết kế chuyên nghiệp, bạn được cung cấp 2 hình ảnh and 1 chủ đề. HÌNH ẢNH 1 là nguồn cảm hứng chính cho **chủ đề and đối tượng**. HÌNH ẢNH 2 là nguồn tham chiếu cho **phong cách, bảng màu, and không khí**. Chủ đề là: '{0}'. Nhiệm vụ của bạn là tạo ra một moodboard đẹp mắt, kết hợp cả hai yếu tố. Moodboard phải bao gồm: một bảng màu được trích xuất from **hình ảnh tham chiếu phong cách**, các hình ảnh truyền cảm hứng phù hợp with **chủ đề from hình ảnh chính**, các mẫu vật liệu (vải, gỗ, kim loại), and các từ khóa liên quan. Sắp xếp các yếu tố này trong một bố cục sạch sẽ, hiện đại. Đầu ra cuối cùng phải là một hình ảnh moodboard duy nhất, gắn kết.",
            extendView: `Bạn là một chuyên gia chỉnh sửa ảnh AI with khả năng "outpainting". Người dùng đã cung cấp một hình ảnh có các vùng màu hồng fuchsia (#FF00FF) ở viền. Đây là một "màn hình xanh" chỉ định khu vực cần vẽ. Nhiệm vụ của bạn là thay thế TOÀN BỘ vùng màu hồng này bằng cách vẽ tiếp nội dung từ hình ảnh trung tâm một cách liền mạch and hợp lý. Phải giữ nguyên 100% nội dung của hình ảnh gốc ở trung tâm. Kết quả cuối cùng phải là một hình ảnh hoàn chỉnh, không còn bất kỳ màu hồng nào.`,
            changeStylePrompt: `Bạn là nhà thiết kế nội thất với hơn 20 năm kinh nghiệm, chuyên thiết kế không gian cao cấp và tư vấn chuyển đổi phong cách nội thất theo xu hướng quốc tế. Bạn có năng lực: Am hiểu chuyên sâu, hệ thống về mọi phong cách thiết kế nội thất (Modern, Minimalism, Japandi, Scandinavian, Wabi-sabi, Industrial, Neoclassical, Luxury, Contemporary, Mid-century, Tropical, Mediterranean, Retro, Vintage, Boho, Classic, Zen, Art Deco…). Tư duy thẩm mỹ cao, từng tham gia và đạt nhiều giải thưởng thiết kế nội thất quốc tế. Khả năng phân tích bố cục không gian từ ảnh, xác định rõ: màu sắc, ánh sáng, vật liệu, đồ nội thất, chi tiết trang trí. Chuyển đổi phân tích thành prompt tạo ảnh chuyên nghiệp dành cho AI Nano Banana, mô tả chính xác, giàu hình ảnh và tối ưu chất lượng đầu ra. Nhiệm vụ (Task): Khi người dùng tải ảnh nội thất và cung cấp phong cách mong muốn, bạn phải: Phân tích không gian trong ảnh gốc (bố cục, ánh sáng, vật liệu, đồ nội thất chính/phụ). Viết 01 đoạn prompt hoàn chỉnh để AI Nano Banana tạo ra phiên bản không gian theo phong cách nội thất được chỉ định. Prompt cần tập trung mạnh vào: Màu sắc chủ đạo & bảng màu theo style yêu cầu Chất liệu bề mặt (gỗ, đá, kim loại, vải, da, kính…) Chi tiết & thiết kế của đồ nội thất theo phong cách mới (form, đường nét, chân ghế, tay vịn, phom tủ, viền, bo cạnh…) Ánh sáng (tự nhiên/đèn/độ mềm, độ tương phản, mood) Không gian & cảm xúc tổng thể đúng phong cách Cho phép thay đổi/ thêm đồ nội thất nếu cần để đúng phong cách chỉ định, nhưng phải đảm bảo: Không phá vỡ bố cục chính của không gian Đồ nội thất bổ sung phải phù hợp with style, có mô tả rõ về chất liệu – màu – kiểu dáng Tổng thể vẫn giống một phiên bản “cùng không gian” nhưng được “styling lại” theo phong cách mới Quy tắc bắt buộc (Constraints): ✅ Chỉ xuất đúng phần PROMPT (không giải thích, không phân tích, không gợi ý thêm). ✅ Giữ đúng tinh thần và cấu trúc không gian gốc (không đổi layout quá mức). ✅ Được phép thay đổi chi tiết đồ nội thất và thêm đồ nội thất để đúng style chỉ định. ✅ Mọi thay đổi phải đồng nhất theo style: màu sắc – vật liệu – bề mặt – hoàn thiện – ánh sáng – hoạ tiết. ✅ Prompt phải ưu tiên tính chân thực cao, đúng ngữ cảnh nội thất, hình ảnh sắc nét. Đầu ra (Output): Một đoạn prompt hoàn chỉnh, sẵn sàng dán trực tiếp vào AI Nano Banana. Prompt rõ ràng, giàu mô tả, có cấu trúc tốt, tối ưu chất lượng đầu ra. Yêu cầu của người dùng là: "{0}"`,
            generateFromPlanningImage: `Hãy đóng vai một Kiến trúc sư Quy hoạch cao cấp với 20 năm kinh nghiệm và chuyên gia viết prompt chuyên nghiệp cho Gemini AI. Nhiệm vụ: Phân tích hình ảnh quy hoạch được tải lên (loại hình quy hoạch, phong cách, các công trình cụ thể, bối cảnh và ánh sáng phù hợp) sau đó viết một đoạn prompt tạo ảnh hoàn chỉnh bằng TIẾNG VIỆT để biến bản vẽ quy hoạch này thành một ảnh chụp kiến trúc thực tế. Cấu trúc: Ảnh chụp Master Plan thực tế góc nhìn chim bay từ trên cao của [loại hình quy hoạch], phong cách thiết kế, [Các hạng mục trong bản vẽ]. Tự sáng tạo bao cảnh và bối cảnh xung quanh cho phù hợp. Ánh sáng: Mô tả rõ ràng về ánh sáng (ví dụ: Ánh sáng Volumetric God Rays, Golden Hour, Ánh sáng Low-Key), góc máy (Wide Shot, Low Angle). Ưu tiên bối cảnh Việt Nam. Chỉ xuất ra nội dung của prompt cuối cùng, không thêm bất kỳ lời dẫn hay phân tích nào, dưới 130 từ.`,
            generateVr360Prompt: `Bạn là một chuyên gia tạo ảnh Panorama 360 độ (VR 360). Nhiệm vụ của bạn là tạo một prompt mô tả không gian dưới dạng 'Equirectangular projection'. 
            Hình ảnh đầu ra PHẢI là một dải toàn cảnh rộng (tỷ lệ 2:1), bao quát trọn vẹn 360 độ quanh điểm đứng của camera. 
            Mép trái và mép phải của ảnh phải khớp nhau hoàn hảo để tạo thành một không gian liên tục không tì vết khi cuộn tròn.
            Hãy sử dụng các từ khóa chuyên môn như: "equirectangular projection", "360 degree panorama", "spherical projection", "VR view", "full sphere".
            Yêu cầu của người dùng là: "{0}".`,
            generateTextureMap: `Bạn là một chuyên gia về vật liệu và texture 3D (PBR materials). Nhiệm vụ của bạn là tạo ra duy nhất một kênh map "{0}" từ ảnh chụp vật liệu này.
YÊU CẦU KỸ THUẬT BẮT BUỘC (CRITICAL):
1. SEAMLESS TILING (LẶP LẠI KHÔNG VẾT): Texture phải có khả năng lặp lại vô tận (tileable) mà KHÔNG LỘ ĐƯỜNG NỐI ở các cạnh. Họa tiết cạnh trái nối khớp cạnh phải, cạnh trên nối khớp cạnh dưới.
2. DELIGHTING (KHỬ BÓNG & SÁNG): Loại bỏ hoàn toàn bóng đổ (shadows) và ánh sáng phản xạ (highlights). Texture phải phẳng (flat), chỉ thể hiện màu sắc bản chất (Albedo) của vật liệu. Không được có hướng ánh sáng định hướng.
3. KHỬ PHỐI CẢNH: Chuyển về góc nhìn trực diện phẳng (Orthographic), không bị nghiêng hay méo.
4. GIỮ NGUYÊN CHI TIẾT: Bảo toàn vân, gai, độ nhám đặc trưng của vật liệu gốc.

Định nghĩa Map "{0}":
- Diffuse/Albedo: Map màu phẳng, không bóng, seamless.
- Normal: Map pháp tuyến (tím/xanh) thể hiện chi tiết lồi lõm.
- Displacement: Map độ cao (trắng cao, đen thấp).
- Roughness: Map độ nhám (trắng nhám, đen bóng).
- AO: Map đổ bóng khe kẽ (Ambient Occlusion).

Kết quả: 01 ảnh texture vuông chất lượng cao, seamless và delighting.`,
            detectPerspectivePrompt: `Phân tích ảnh kiến trúc này và xác định 4 điểm (trên-trái, trên-phải, dưới-phải, dưới-trái) đại diện cho một mặt phẳng hình chữ nhật trong thực tế (ví dụ: mặt tiền tòa nhà).
            Trả về tọa độ dưới dạng đối tượng JSON: {"points": [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]}.
            Tọa độ phải nằm trong dải chuẩn hóa 0-1000.
            Chỉ trả về JSON.`,
        },
        constants: {
            interiorLightingOptions: interiorLightingOptions,
            exteriorLightingOptions: exteriorLightingOptions,
            predefinedReferenceImages: {
                building: [
                    { name: 'Phong cách Tòa nhà 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092588730600_40c3acebfcd07f7ea9029c82ca948a59.jpg' },
                    { name: 'Phong cách Tòa nhà 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092588735695_52147b30644d6a42bec87f807661f7ff.jpg' },
                    { name: 'Phong cách Tòa nhà 3', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637645602_0a8bfc1046d9bfeeee62aac28d1afe87.jpg' },
                    { name: 'Phong cách Tòa nhà 4', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637644035_6298697cb54748adc10d86a43ebdfa7b.jpg' },
                    { name: 'Phong cách Tòa nhà 5', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637643871_90807b3e08c2575e83dab45b46f94e87.jpg' },
                ],
                house: [],
                villa: [
                    { name: 'Phong cách Biệt thự 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUVILLA/main/z7092637643969_cd6b5c0e95120c877168f822520f18b7.jpg' },
                    { name: 'Phong cách Biệt thự 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUVILLA/main/z7092637649555_89ab81eea211c0448237820852b9a246.jpg' },
                ],
                'quy hoạch': [],
            },
            predefinedMaterialImages: {
                Vietceramics: [
                    { name: 'Gạch 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/g%E1%BA%A1ch%20viet.png' },
                    { name: 'Gạch 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/g%E1%BA%A1ch%20vi%E1%BB%87t%202.png' },
                    { name: 'Gạch 3', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/magnifics_upscale-Lu5GdD9tveHqz5D5Usjd-download%20-%202025-11-10T130047.509.png' },
                    { name: 'Gạch 4', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/magnifics_upscale-iXjSI9sXl1O3DpQwkvRI-download%20-%202025-11-10T125830.428.png' },
                ]
            },
            ASPECT_RATIO_LABELS: { auto: 'Tự động', '1:1': 'Vuông (1:1)', '4:3': 'Ngang (4:3)', '3:4': 'Dọc (3:4)', '16:9': 'Rộng (16:9)', '9:16': 'Story (9:16)', '2:3': 'Dọc (2:3)', '3:2': 'Ngang (3:2)' },
            stylePrompts: ["phong cách hiện đại", "phong cách tối giản", "phong cách neoclassic", "phong cách Indochine", "phong cách công nghiệp", "phong cách Scandinavian"],
            contextPrompts: ["ở đường phố việt nam", "ở vùng làng quên việt nam", "ở khu đô thị sang trọng, hiện đại vinhomes hà nội", "ở ngã ba đường phố việt nam", "ở sân vườn nhiệt đới tại miền quên việt nam", "nằm bên đường nhựa with 2 bên cạnh nhà là cây xanh", "nằm trong Vườn châu Âu rộng, lối đi lát đá, tượng thần and cây cắt tỉa hình khối", "nằm dưới chân núi hùng vĩ, bao quanh là khu vườn xanh mướt and cây lá mùa thu nhiều màu sắc. Phía trước có hồ bơi and thảm cỏ phẳng mượt"],
            lightingPrompts: ["Ánh sáng ban ngày tự nhiên, trời trong xanh", "Ánh sáng hoàng hôn ấm áp, đổ bóng dài", "Ánh sáng ban đêm, ánh trăng chiếu sáng toàn cảnh, nhấn mạnh đèn nội thất and ngoại thất", "Trời u ám, ánh sáng dịu, không có bóng gắt", "bình minh with ánh sáng trong trẻo and không khí yên bình.", "buổi hoàng hôn tím with ánh sáng đèn nội thất hắt ra lung linh", "sương mù dày đặc vào sáng sớm tạo cảm giác huyền ảo.", "trời vừa mưa xong đường hơi ướt, bầu trời mây nhẹ"],
            cameraAnglePrompts: [{ display: "Chụp từ trên cao xuống", value: "Chụp từ trên cao xuống (high-angle shot)"}, { display: "Góc thấp (cảm giác hùng vĩ)", value: "Góc thấp từ dưới nhìn lên, tạo cảm giác công trình cao lớn, hùng vĩ (low-angle shot)"}, { display: "Góc nhìn 3/4 từ bên trái", value: "Góc nhìn 3/4 từ bên trái, thể hiện chiều sâu , giữ nguyên bối cảnh đường phố Việt Nam, nhà hàng xóm and bầu trời xanh."}, { display: "Góc nhìn 3/4 từ bên phải", value: "Góc nhìn 3/4 từ bên phải, thể hiện chiều sâu , giữ nguyên bối cảnh đường phố Việt Nam, nhà hàng xóm and bầu trời xanh."}, { display: "Chụp cận cảnh chi tiết", value: "Chụp cận cảnh chi tiết (detailed close-up shot)"}, { display: "Góc nhìn 3/4 từ bên phải", value: "Góc nhìn 3/4 từ bên phải, thể hiện chiều sâu , giữ nguyên bối cảnh đường phố Việt Nam, nhà hàng xóm and bầu trời xanh."}, { display: "Góc chụp chính diện, đối xứng", value: "góc chụp chính diện mặt tiền công trình, góc nhìn thẳng, đối xứng"}],
            planStylePrompts: ["phong cách hiện đại, tông màu trắng and gỗ", "phong cách tối giản (minimalist), nội thất thông minh", "phong cách scandinavian, ánh sáng tự nhiên", "phong cách sang trọng (luxury), vật liệu cao cấp như đá marble, kim loại mạ vàng", "phong cách Indochine, kết hợp truyền thống and hiện đại"],
            planRoomTypePrompts: ["phòng ngủ", "phòng khách", "phòng bếp", "phòng ăn", "phòng tắm"],
            planColorizePrompts: ["Tô màu mặt bằng theo phong cách bán hiện thực (Semi-realistic)", "Tô màu mặt bằng with nền đen and nét trắng, kiểu bản vẽ kỹ thuật", "Tô màu mặt bằng theo phong cách chất liệu cơ bản (Material Base), thể hiện rõ vật liệu gỗ, gạch, bê tông", "Tô màu mặt bằng theo phong cách marker (Marker Style), giống như vẽ tay bằng bút marker", "Tô màu mặt bằng theo phong cách màu nước (Watercolor Style)", "Tô màu mặt bằng theo phong cách hiện thực (Photorealistic), with đổ bóng and vật liệu chân thực"],
            videoPrompts: [{ display: "Time-lapse Ngày & Đêm", value: "Time-lapse of building from morning to night" }, { display: "Drone circle", value: "Flycam drone orbiting the building" }, { display: "Clouds time-lapse", value: "Clouds passing over on a sunny day" }, { display: "Light rain", value: "Building during a light rain shower with reflections" }, { display: "Zoom into entrance", value: "Slow zoom into the main entrance" }, { display: "Facade pan", value: "Camera panning across the facade from left to right" }],
            materialChangeOptions: [{ display: "Thay vật liệu sàn", value: "Thay vật liệu sàn ở ảnh 1 bằng vật liệu mới trong ảnh 2, chia thành từng viên gạch theo tỉ lệ 800x800" }, { display: "Thay vật liệu thảm", value: "Thay vật liệu thảm ở ảnh 1 bằng thảm họa tiết mới trong ảnh 2" }, { display: "Thay rèm cửa", value: "Thay rèm cửa ở ảnh 1 bằng rèm cửa mới trong ảnh 2" }],
            materialTypeOptions,
            tileSizeOptions,
            materialPropertyOptions,
            tilePatternOptions,
            furnitureChangeOptions: [{ display: "Thay sofa", value: "xóa bộ sofa trong ảnh 1, sau khi xóa xong thêm bộ sofa mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt bộ sofa ảnh 2 không được thay đổi thêm bớt" }, { display: "Thay đèn trùm", value: "xóa đèn trùm trong ảnh 1, sau khi xóa xong thêm đèn trùm mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt đèn trùm ảnh 2 không được thay đổi thêm bớt" }, { display: "Thay bàn trà", value: "xóa bàn trà trong ảnh 1, sau khi xóa xong thêm bàn trà mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt bàn trà ảnh 2 không được thay đổi thêm bớt" }, { display: "Thay kệ tivi", value: "xóa kệ tivi trong ảnh 1, sau khi xóa xong thêm kệ tivi mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt kệ tivi ảnh 2 không được thay đổi thêm bớt" }, { display: "Thay bàn ăn", value: "xóa bàn ăn trong ảnh 1, sau khi xong thêm bàn ăn mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt bàn ăn ảnh 2 không được thay đổi thêm bớt" }, { display: "Thay tủ bếp", value: "xóa tủ bếp trong ảnh 1, sau khi xong thêm tủ bếp mới trong ảnh 2 vào vị trí đó, giữ đúng chi tiêt tủ bếp ảnh 2 không được thay đổi thêm bớt" }],
            interiorRoomTypes: [
                "Phòng khách (Living Room)",
                "Phòng ngủ Master (Master Bedroom)",
                "Phòng bếp & Ăn (Kitchen & Dining)",
                "Phòng tắm (Bathroom)",
                "Phòng làm việc (Home Office)",
                "Phòng thờ (Worship Room)",
                "Sảnh đón (Lobby)"
            ],
            interiorStyles: [
                "Phong cách Hiện đại (Modern)",
                "Phong cách Tối giản (Minimalism)",
                "Phong cách Bắc Âu (Scandinavian)",
                "Phong cách Đông Dương (Indochine)",
                "Phong cách Tân cổ điển (Neoclassical)",
                "Phong cách Wabi Sabi",
                "Phong cách Sang trọng (Luxury)",
                "Phong cách Công nghiệp (Industrial)"
            ],
            interiorLighting: [
                "Ánh sáng tự nhiên dịu nhẹ (Soft Natural Light)",
                "Ánh sáng nắng gắt tương phản (Hard Sunlight & Shadows)",
                "Ánh sáng vàng ấm cúng (Warm Ambient Light)",
                "Ánh sáng điện ảnh (Cinematic Mood Lighting)",
                "Ánh sáng studio (Bright Studio Lighting)",
                "Ánh sáng hoàng hôn (Golden Hour Interior)",
                "Ánh sáng ban đêm & Đèn nhân tạo (Night & Artificial Lights)"
            ],
            planningObjects: [
                "Khu đô thị (Urban Area)",
                "Khu công nghiệp (Industrial Zone)",
                "Khu du lịch (Tourism Area)",
                "Khu dân cư nông thôn (Rural Residential)",
                "Công viên chuyên đề (Theme Park)",
                "Hạ tầng kỹ thuật (Technical Infrastructure)"
            ],
            planningStyles: [
                "Phong cách Hiện đại (Modern)",
                "Đô thị Xanh (Green City)",
                "Đô thị Thông minh (Smart City)",
                "Phong cách Bền vững (Sustainable)",
                "Kiến trúc Sinh thái (Eco-Architecture)",
                "Phong cách Tương lai (Futuristic)"
            ],
            planningStructures: [
                "Biệt thự đơn lập",
                "Nhà phố, shophouse liền kề",
                "Tòa nhà cao tầng",
                "Trung tâm thương mại",
                "Trường học",
                "Công viên cây xanh",
                "Hồ nước",
                "Quán cafe",
                "Bungalow",
                "Quảng trường trung tâm",
                "Cầu vượt"
            ],
            planningContexts: [
                "Xung quanh là cánh đồng và làng mạc",
                "Xung quanh là các khu đô thị và giao thông",
                "Xung quanh là đồi núi hùng vĩ và thung lũng",
                "Xung quanh là công viên, hồ nước và cây xanh",
                "Xung quanh là dải ven biển và resort nghỉ dưỡng",
                "Xung quanh là khu tổ hợp công nghệ cao và công nghiệp"
            ],
            planningLightings: [
                "Bình minh trong trẻo (Early Morning)",
                "Ánh sáng ban ngày rực rỡ (Bright Daylight)",
                "Hoàng hôn vàng rực (Golden Hour)",
                "Hoàng hôn tím huyền ảo (Purple Sunset)",
                "Ban đêm với ánh đèn đô thị rực rỡ (Urban Night)",
                "Trời u ám, sắp có mưa (Overcast)",
                "Sương mù mờ ảo (Misty Morning)"
            ]
        }
    },
    en: {
        appTitle: "NEVA Studio",
        selectModel: "Select model",
        apiKeyModalTitle: "Paste Google AI Studio API key",
        apiKeyModalDescription: "Paste your API key and confirm. It will be saved for future use on this device.",
        apiKeyPlaceholder: "Paste your Google AI Studio API key here...",
        apiKeyStorageHint: "The API key is stored locally in this browser.",
        apiKeySavedDescription: "The API key has been saved and will be reused next time.",
        apiKeySavedShort: "Saved key",
        apiKeyEmptyError: "Please paste an API key before confirming.",
        apiKeySaveError: "Unable to save the API key on this device.",
        developedBy: "Developed by NEVA Studio",
        sponsoredBy: "Development sponsored by VietCG",
        apiVersionWarning: "This version requires a Google API key to work, see instructions on the right",
        changeLanguage: "Change Language",
        welcomeHeader: "NEVA Studio",
        welcomeDescription: "AI application for architecture and interior design. Turn ideas into production-ready visuals immediately.",
        welcomeStartButton: "Get Started",
        navHome: "HOME",
        navHistory: "HISTORY",
        navSettings: "SETTINGS",
        settingsTitle: "SETTINGS",
        appearance: "Appearance",
        theme: "Theme",
        themeDark: "Dark",
        themeLight: "Light",
        themeWarm: "Warm (Default)",
        themeCold: "Cold",
        toolLabel: "AI TOOL",
        freeGenTitle: "Free Image Gen",
        freeGenDesc: "Generate high quality images from text for free.",
        proGenTitle: "API Image Gen",
        proGenDesc: "Use the most powerful model (Gemini 3 Pro) for high detail generation.",
        tabCreate: "Create Image",
        tabArchitecture: "Architecture",
        tabInterior: "Interior",
        tabPlanning: "Planning",
        tabCameraAngle: "View Creator",
        subTabCameraAngle: "Camera Angle",
        tabEdit: "Edit Image",
        tabPlanTo3D: "Floor Plan",
        tabCanvaMix: "Canva Mix",
        tabCreatePrompt: "Magic Prompt",
        tabTrend: "Trend",
        tabCreateVideo: "Create Video",
        library: "Library",
        tabUtilities: "Utilities",
        selectionTool: "Selection Tool",
        drawTool: "Draw",
        rectTool: "Rectangle",
        strokeWidth: "Stroke Width",
        clearDrawing: "Clear Drawing",
        uploadImage: "Upload Image",
        uploadImageOptional: "Upload Image (Optional)",
        handDrawnHint: "Hand-drawn images or SketchUp models without shadows are preferred.",
        referenceImage: "Reference Image (Style)",
        prompt: "Prompt",
        negativePrompt: "Negative Prompt",
        negativePromptHelp: "List things you don't want to see in the image. e.g., ugly, deformed, low quality, blurry, signature...",
        aspectRatio: "Aspect Ratio",
        imageCount: "Number of Images",
        imageSize: "Image Size (API Only)",
        dropzoneHint: "Drag & drop, paste, or click",
        dropzoneFormats: "PNG, JPG, WEBP",
        delete: "Delete",
        choosePresetImage: "Choose from presets",
        close: "Close",
        referenceImageHelp: "The AI will draw inspiration for style, lighting, context, and materials.",
        processingImage: "Processing image...",
        addFromPresets: "Or add from preset prompts:",
        style: "Style",
        context: "Context",
        lighting: "Lighting",
        roomType: "Room Type",
        planningObject: "Planning Object",
        planningStyle: "Planning Style",
        planningStructure: "Structure",
        aspectRatioHelp: "Only effective when 'Source Image' is not uploaded.",
        generateFromImage: "Prompt from Image",
        generateFromPromptText: "Prompt from Prompt",
        generating: "Generating...",
        specifyCloseUpAngle: "Specify Close-up Angle (Optional)",
        specifyCloseUpHelp: "Draw a rectangle on the image for the AI to automatically render a close-up of that area.",
        selectArea: "Select Area",
        cancel: "Cancel",
        clearSelection: "Clear Selection",
        chooseCameraAngle: "Choose Camera Angle",
        selectCameraAnglePlaceholder: "-- Select a camera angle --",
        customDescription: "Custom Description",
        customDescriptionPlaceholder: "e.g., shot from a 3/4 low angle...",
        chooseFunction: "Choose Function",
        editSelectedArea: "Edit Selection",
        smartEdit: "Smart Edit",
        mergeHouse: "Merge House",
        mergeMaterial: "Change Material",
        mergeFurniture: "Change Furniture",
        editFunctionHelp: {
            inpaint: "Remove or replace objects by drawing a selection and entering a description.",
            smartEdit: "High-fidelity editing by selecting a focused work area (box) and a change target (mask).",
            mergeHouse: "Merge a new building into an existing context.",
            mergeMaterial: "Apply material from the second image to an object in the source image.",
            mergeFurniture: "Replace furniture in the source image with items from the second image.",
            canva: "Compose multiple furniture items (PNG) into a space with realistic lighting and scale."
        },
        uploadSourceImage: "Upload Source Image",
        uploadContextImage: "Upload Context Image (Image 1)",
        contextImageHelp: "The context image with the area for merging painted in red.",
        resetImage: "Delete Image & Restart",
        chooseToolAndDraw: "Choose Tool & Draw Selection",
        lassoTool: "Lasso",
        brushTool: "Brush",
        lineThickness: "Line Thickness",
        brushSize: "Brush Size",
        uploadReferenceOptional: "Upload Reference Image (Optional)",
        referenceImageHelpEdit: "The AI will take inspiration from this image to modify the selected area.",
        uploadBuildingImage: "Upload Building Image (Image 2)",
        uploadMaterialFurnitureImage: "Upload Material/Furniture Image (Image 2)",
        image2Help: "Note: Use a background-removed image and match the aspect ratio of Image 2 to Image 1.",
        promptPlaceholder: {
            create: "e.g., a modern house, daylight, realistic photo...",
            negative: "e.g., text, signature, low quality, noise",
            inpaint: "e.g., add an arched window...",
            smartEdit: "Describe changes for the masked area within the frame...",
            mergeHouse: "Describe how to merge the images...",
            mergeMaterial: "e.g., replace the rug in image 1 with the patterned rug in image 2",
            mergeFurniture: "Describe how to merge the images...",
            planTo3dRender: "Modern living room...",
            planTo3dColorize: "Pastel color scheme...",
            video: "Describe the motion...",
            videoPrompt: "e.g., a slow flycam shot approaching the building from a distance...",
            vr360: "e.g., luxury hotel lobby, 360 panorama, modern architecture..."
        },
        promptExamples: "Or select a sample prompt:",
        selectOption: "-- Select an option --",
        upload2dPlan: "Upload 2D Plan",
        chooseGoal: "Choose Goal",
        create3DImage: "Create 3D Image",
        colorizePlan: "Colorize Plan",
        analyzePlanPrompt: "Analyze Style Sample",
        suggestions: "Suggestions",
        motionDescription: "Motion Description",
        selectSuggestion: "-- Select a suggestion --",
        uploadSpaceImage: "Upload Space Image (Background)",
        changeBgImage: "Change Background Image",
        clickOrDropNew: "Click or drag a new image",
        deleteAll: "Delete All",
        uploadDecorImage: "Upload Decor Images (BG removed)",
        decorHelp: "Using PNGs with transparent backgrounds is recommended",
        clickToAdd: "Click to add to canvas",
        adjustments: "Adjustments",
        lockLayout: "Lock Layout",
        deleteObject: "Delete object (or use Backspace key)",
        rotate: "Rotate",
        flipHorizontal: "Flip Horizontal",
        flipVertical: "Flip Vertical",
        uploadToAnalyze: "Upload Image to Analyze",
        analyzeHelp: "The AI will analyze the image and create 20 professional photography prompts.",
        uploadCharacterImage: "Upload Character Image (Optional)",
        characterHelp: "AI will analyze and insert this character into shots with people.",
        characterDescriptionLabel: "Character in image",
        analyzingCharacter: "Analyzing character...",
        uploadStartImage: "Upload Starting Image",
        virtualTourHelp: "Upload a render to begin your virtual tour.",
        createImage: "Generate Image",
        createVideo: "Generate Video",
        createPrompt: "Generate Prompt",
        choosePresetMaterial: "Choose preset material",
        symbolicLink: "Symbolic Link",
        loadingReference: "Loading image...",
        loadingStart: "Starting generation process...",
        loadingAnalyzePrompts: "Analyzing image and creating prompts...",
        loadingAnalyzingArea: "Analyzing and recreating details for selected area...",
        loadingMessageDefault: "Generating images, please wait a moment...",
        loadingUsageLimit: "NEVA Studio Usage Limit:",
        loadingUsageText: "Each user can generate 40–45 images per day. To increase your generation count, you can use 2–3 different Gmail accounts.",
        loadingUsageNote: "👉 Note: Each email should be logged in on a separate browser or Chrome profile to avoid account conflicts.",
        loadingAdText: "If you want to create better photos, you can refer to the AI application courses in architecture and interiors by AIAI - Contact 0387414593",
        loadingVideoHeader: "The AI is creating your video...",
        loadingVideoHelp: "Video generation can take a few minutes. Please do not close or reload the page.",
        loadingPromptHeader: "Generating prompts...",
        loadingPromptHelp: "The AI is analyzing your image to create unique photography descriptions.",
        emptyStateHeader: "Render Results",
        emptyStateText: "Your results will appear here.",
        emptyCanvaHeader: "Your Creative Space",
        emptyCanvaText: "Upload a 'space image' in the control panel to begin.",
        emptyPromptHeader: "Professional Prompt Suggestions",
        emptyPromptText: "Upload an image in the control panel and the AI will generate 20 prompts in a photographer's style.",
        emptyTourHeader: "Virtual Tour",
        emptyTourText: "Upload a render in the control panel to start your tour.",
        tourHistory: "Tour History",
        fullscreen: "Fullscreen",
        editThisImage: "Edit this image",
        useAsSource: "Use as source image",
        downloadImage: "Download image",
        downloadVideo: "Download video",
        copyPrompt: "Copy prompt",
        noPrompt: "No prompt available",
        createFromThisPrompt: "Generate from this prompt",
        tourUndo: "Undo",
        tourRedo: "Redo",
        saveToLibrary: "Save to Library",
        saved: "Saved!",
        history: "History",
        clearAll: "Clear All",
        deleteSelected: "Delete Selected",
        selectMultiple: "Select Multiple",
        cancelSelection: "Cancel Selection",
        confirmClearLibrary: "Are you sure you want to clear the entire library?",
        clearHistoryConfirm: "Are you sure you want to clear all history? This can help improve app performance.",
        review: "Review",
        images: "images",
        prompts: "Prompts",
        historyEmpty: "Results from previous generations will be saved here.",
        historyPerformanceTip: "Clearing history periodically helps keep the app running smoothly.",
        libraryEmptyHeader: "Your Library is Empty",
        libraryEmptyText: "Save images you like from the gallery to see them here.",
        deleteFromLibrary: "Delete from Library",
        closeFullscreen: "Close",
        editImage: "Edit Image",
        reset: "Reset",
        saveImage: "Save Image",
        apiKeyRequired: "API Key Required",
        apiKeyDescription: "To use the video generation feature, you need to select an API Key from your Google Cloud project. This feature uses the Veo model and may incur costs.",
        apiKeyBillingInfo: "For more information on pricing, please refer to the",
        billingDocs: "billing documentation",
        selectApiKey: "Select API Key",
        alertUploadSource: "Please upload a source image.",
        alertDrawMask: "Please draw a selection on the image to edit.",
        alertSelectSmartBox: "Please select a work frame (Step 1) on the image.",
        alertSelectSmartMask: "Please paint the change area (Step 2) inside the frame.",
        alertUploadBothImages: "Please upload both images to proceed.",
        alertUploadBg: "Please upload a space image (background).",
        alertUploadDecor: "Please upload at least one decor image.",
        alertEnterPrompt: "Please enter a description (prompt).",
        alertGenerationFailed: "An error occurred during generation. Please check your API key and try again.",
        alertInvalidApiKey: "Invalid or deleted API Key. Please select a different API Key.",
        alertNoSourceForPrompt: "Could not find the source image from the Create Prompt tab. Please try again.",
        alertImageGenFailedRetry: "An error occurred while generating the image. Please try again.",
        alertTourFailed: "An error occurred while generating the next frame.",
        alertApiKeyUtilUnavailable: "API Key selection utility is not available.",
        alertImageGenFailed: "AI did not return any images.",
        alertMoodboard: "Please upload an inspiration image and enter a theme description.",
        alertLighting: "Please upload an image and select at least one lighting type.",
        alertVideoPrompt: "Please upload a source image and enter a motion request.",
        alertStyleChange: "Please upload an image, enter a style request, and generate a prompt before generating images.",
        alertStylePromptGen: "Please upload an image and enter a style request to generate a prompt.",
        alertSelectArea: "Please select an area on the image first.",
        donate: "Donate",
        promptInitial: "A realistic photo of a house",
        promptInterior: "A realistic interior photo",
        promptInitialPlanning: "a realistic bird's-eye view master plan photo of",
        promptCloseUp: "Detailed close-up shot focused on",
        promptCanvaMix: "Canva Mix generation",
        promptArchitecturalGenerated: "Generated Architectural Prompts",
        defaultNegativePrompt: "cartoon, 2d illustration, sketch, cgi, render artifact, fake render, unreal engine style, game asset, lowpoly, plastic surface, wax texture, flat lighting, incorrect reflections, overexposed, undesignated lighting, low contrast, washed out, noisy, blurry, depth map error, distorted perspective, unrealistic scale, fake shadows, wrong proportion, low resolution, low detail, low quality, over-saturated, oversharpened edges, halo, outline, glowing edges, bad composition, incorrect DOF, cutout, text, watermark, logo, posterized, painting, drawing, toy-like, artificial lighting, non-realistic material, duplicated objects, blurry wall texture, flat materials, poor texture mapping, distorted lines, model border",
        utilitiesTitle: "Extended Utilities",
        moodboardTitle: "Create Moodboard",
        moodboardDesc: "Upload an image and enter a description for the AI to create a complete moodboard with a color palette, materials, and related images.",
        videoPromptTitle: "Video Scenarios",
        videoPromptDesc: "Generate detailed motion scripts for architectural videos.",
        lightingTitle: "Lighting Setup",
        lightingDesc: "Test different lighting scenarios for your model.",
        virtualTourTitle: "Virtual Tour",
        virtualTourDesc: "Upload a 3D render and navigate through the space using AI.",
        extendViewTitle: "Extend View",
        extendViewDesc: "Extend the frame of your image to a desired aspect ratio. The AI will automatically draw the missing parts.",
        changeStyleTitle: "Change Style",
        changeStyleDesc: "Upload an image, describe a new style, and the AI will generate a professional prompt to transform your image.",
        interiorViewTitle: "Space Creator",
        interiorViewDesc: "Create 9 different spaces derived from one reference image while maintaining style and materials.",
        architectureViewTitle: "Architecture Creator",
        architectureViewDesc: "Upload architecture photo, AI creates 9 camera angles from it.",
        archToInteriorTitle: "Interior from Architecture",
        archToInteriorDesc: "Upload architecture photo, AI creates 9 interior camera angles from it.",
        interiorDetailTitle: "Interior Detail Creator",
        interiorDetailDesc: "Upload an image and AI will create 9 different close-up views focusing on furniture, loose items, materials, and artistic angles.",
        syncViewTitle: "Sync View",
        syncViewDesc: "Harmonize style, materials, and lighting from a sample image into other camera angles.",
        lightingSimulationTitle: "Lighting & Style Simulation",
        lightingSimulationDesc: "Redraw rendered images to match the mood and style of a reference image.",
        constructionProcessTitle: "Construction Process",
        constructionProcessDesc: "Recreate construction stages from rough site to finished landscape based on a real photo.",
        canvaMixTitle: "Canva Mix",
        canvaMixDesc: "Compose furniture and decor into a space with realistic lighting and perspective.",
        vr360Title: "VR 360",
        vr360Desc: "Create 360 spaces from descriptions or upload a Panorama image for VR tour.",
        vr360ViewTitle: "Your 360 Space",
        vr360ViewDesc: "Drag to look around.",
        uploadVrImage: "Upload 360 Panorama",
        vr360PromptLabel: "360 Space Description",
        generateVrButton: "Generate VR 360",
        confirmAreaPrompt: "Confirm Close-up Prompt",
        editAreaPromptDesc: "AI has analyzed the selection. You can edit the description below before generating.",
        confirmAndGenerate: "Confirm & Generate",
        textureMapTitle: "Texture Map Creator",
        textureMapDesc: "Generate various PBR maps (Diffuse, Normal, Roughness...) from a material photo.",
        textureMapStep1: "1. Upload Material Photo",
        textureMapStep2: "2. Crop Texture Area (Optional)",
        textureMapStep3: "3. Select Map Channels",
        textureMapEmptyHeader: "Your Textures",
        textureMapEmptyText: "Upload an image and crop a material area to begin generating maps.",
        generateMaps: "Generate Texture Maps",
        generatingMaps: "Calculating map channels...",
        comingSoon: "Coming Soon",
        backToUtilities: "Back to Utilities",
        uploadInspirationImage: "1. Upload Inspiration Image",
        uploadReferenceImage: "2. Upload Reference Image (Style)",
        moodboardPromptHelp: "3. Describe the theme or style",
        moodboardReferenceHelp: "The AI will draw color and style inspiration from this image.",
        moodboardImageCount: "4. Number of Results",
        generateMoodboardButton: "Generate Moodboard",
        moodboardEmptyHeader: "Your Moodboard",
        moodboardEmptyText: "Upload an image and enter a prompt to get started.",
        generatingMoodboard: "Generating moodboard...",
        moodboardSamplePrompt: "Use sample prompt",
        moodboardSamplePromptText: "create a furniture moodboard, separating each piece with a white background. There will be a central overall image, below will be the separated furniture pieces (bed, nightstand, wardrobe, logo, rug, curtain), on the right will be the color palette and materials, all neatly arranged in a vertical frame with a white background.",
        uploadModelImage: "1. Upload Model Image",
        chooseLighting: "2. Choose Lighting Type",
        interiorLighting: "Interior Lighting",
        exteriorLighting: "Exterior Lighting",
        generateLightingButton: "Generate with New Lighting",
        lightingEmptyHeader: "Your Lighting Space",
        lightingEmptyText: "Upload an image to start testing lighting scenarios.",
        generatingLighting: "Generating new image...",
        motionRequest: "2. Motion Request (in Vietnamese)",
        generatingVideoPrompt: "Generating video prompt...",
        generatedVideoPromptTitle: "Generated Prompt (English)",
        videoPromptEmptyHeader: "Your Video Script",
        videoPromptEmptyText: "Upload an image and enter a request for the AI to create a professional video prompt.",
        uploadImageToExtend: "1. Upload image to extend",
        chooseAspectRatio: "2. Choose new aspect ratio",
        generateExtendedView: "Extend View",
        generatingExtendedView: "Extending view...",
        extendViewEmptyHeader: "Your Extended View",
        extendViewEmptyText: "Upload an image and choose a ratio to start.",
        uploadImageForStyleChange: "1. Upload image to restyle",
        enterStyleRequest: "2. Enter style request",
        styleRequestPlaceholder: "e.g., Indochine style, cyberpunk style, warm color palette...",
        generateNewPromptButton: "Generate New Prompt",
        generatedPromptReady: "3. Prompt is ready! (Editable)",
        generateStyledImageButton: "Generate with New Style",
        generatingStylePrompt: "Generating new prompt...",
        generatingStyledImages: "Generating new styled images...",
        interiorViewStep1: "1. Upload Reference Image",
        interiorViewStep1Desc: "Upload an image whose style and materials you want to replicate.",
        interiorViewStep2: "2. Upload Character Image (Optional)",
        interiorViewStep2Desc: "If uploaded, this character will appear in the spaces.",
        interiorViewStep3: "3. Start Creativity",
        interiorViewStep3Desc: "AI will generate 9 consistent spaces.",
        architectureViewStep1: "1. Upload Architecture Model",
        architectureViewStep1Desc: "Upload a basic form or style you want to evolve.",
        architectureViewStep2: "2. Upload Character Image (Optional)",
        architectureViewStep2Desc: "If uploaded, people will appear in the options.",
        architectureViewStep3: "3. Start Creativity",
        architectureViewStep3Desc: "AI generate 9 different architectural options.",
        archToInteriorStep1: "1. Upload Architecture Photo",
        archToInteriorStep1Desc: "Upload exterior photo. AI will design corresponding interior spaces.",
        archToInteriorStep2: "2. Upload Character (Optional)",
        archToInteriorStep2Desc: "Person will be included in the interior designs.",
        archToInteriorStep3: "3. Create Interiors",
        archToInteriorStep3Desc: "AI creates 9 spaces (living, bed, kitchen...) matching architectural style.",
        syncViewStep1: "1. Upload Reference View",
        syncViewStep1Desc: "Upload a high-quality render to define style, material, and lighting.",
        syncViewStep2: "2. Upload View to Sync",
        syncViewStep2Desc: "Upload a sketch or draft from a different angle.",
        syncViewStep3: "3. Start Synchronization",
        syncViewStep3Desc: "AI will redraw the 2nd view using the style from the 1st view.",
        lightingSimulationStep1: "1. Upload Rendered Image",
        lightingSimulationStep1Desc: "Upload your current render that you want to restyle.",
        lightingSimulationStep2: "2. Upload Style Reference",
        lightingSimulationStep2Desc: "Upload an image with the desired mood and render style.",
        lightingSimulationStep3: "3. Simulate Lighting",
        lightingSimulationStep3Desc: "AI will redraw Image 1 following the scenario of Image 2.",
        constructionStep1: "1. Upload Finished Building Photo",
        constructionStep1Desc: "Upload a photo of the completed building for the AI to reverse-engineer stages.",
        constructionStep2: "2. Simulate Sequence",
        constructionStep2Desc: "AI will generate 5 images corresponding to major construction stages.",
        stageMessy: "Messy Rough State",
        stageCleaned: "Cleaned Site",
        stageRough: "Rough Structure",
        stageFinishing: "Finishing (Paint/Windows)",
        stageLandscape: "Landscape & Garden",
        stageFinal: "Actual Completion",
        convertToWatercolor: "Watercolor Sketch",
        convertingToWatercolor: "Converting to Watercolor Sketch...",
        generatingConstructionViews: "Simulating construction stages...",
        generatingArchitectureViews: "Analyzing and generating architectural options...",
        generatingArchitectureOption: "Generating {0}...",
        downloadAll: "Download All",
        roomLiving: "Living Room",
        roomBedroom: "Bedroom",
        roomKitchen: "Kitchen",
        roomDining: "Dining Room",
        roomStudy: "Study Room",
        roomBath: "Bathroom",
        roomHall: "Hallway",
        roomDetail: "Close-up",
        roomOutdoor: "Balcony / Garden",
        archOption: "Option",
        archViewTypes: {
            wide1: "Wide Shot 1 (Dawn)",
            wide2: "Wide Shot 2 (Sunset)",
            wide3: "Wide Shot 3 (Drone)",
            close1: "Close-up 1 (Surface Material)",
            close2: "Close-up 2 (Structural Detail)",
            close3: "Close-up 3 (Entrance & Lobby)",
            close4: "Close-up 4 (Existing Corner)",
            artistic1: "Artistic 1 (Foreground Blur)",
            artistic2: "Artistic 2 (Night Mode)"
        },
        interiorDetailViewTypes: {
            detail1: "Close-up Sofa & Fabric",
            detail2: "Close-up Table & Decor",
            detail3: "Close-up Lamp & Lighting",
            detail4: "Wood & Stone Detail",
            detail5: "Metal & Joint Detail",
            detail6: "Artistic Decor Corner",
            artistic1: "Bokeh (Blurred Background)",
            artistic2: "Chiaroscuro (High Contrast)",
            artistic3: "Minimalist Composition"
        },
        smartEditStep1: "1. Select Work Area (Box)",
        smartEditStep1Desc: "Select a small region around the object for focused processing.",
        smartEditStep2: "2. Paint Target (Mask)",
        smartEditStep2Desc: "Only the red-painted areas will be changed by AI.",
        smartEditStep3: "3. Enter description",
        smartEditStep4: "4. Render & Composite",
        trendLayoutTitle: "Sheet Layout",
        trendLayoutDesc: "Generate architectural sheet layouts from concepts.",
        trendModelTitle: "Create Blueprint",
        trendModelDesc: "Generate orthographic technical drawings.",
        trendDiagramTitle: "Create Diagram",
        trendDiagramDesc: "Generate architectural analysis diagrams.",
        trendAnalyzeTitle: "Analyze Form",
        trendAnalyzeDesc: "Analyze forms and architecture from images.",
        trendMoodboardTitle: "Moodboard",
        trendMoodboardDesc: "Create idea boards and material palettes.",
        engineeredPrompts: {
            zoomMagnifyPrompt: `Act as a high-fidelity super-resolution and architectural photography expert. Task: Perform a "Close-up Render" of the provided image area.
**MANDATORY REQUIREMENTS**:
1. PRESERVE 100% of the architectural geometry, lines, and structural details from the source. Do not add, remove, or distort the physical structure.
2. Reconstruct material textures with extreme sharpness: wood grains, stone veins, fabric weaves, reflections, and surface roughness must be photorealistic and more detailed than the source.
3. You may adjust the camera angle subtly (e.g., artistic tilt, low-angle) for better composition, but the object's identity and details MUST remain identical to the original.
4. Lighting and color palette must be perfectly consistent with the source environment.
Result: A hyper-realistic, high-resolution macro architectural photograph with absolute detail fidelity.`,
            analyzeCharacterPrompt: "Analyze the person in this image. Describe appearance focusing on: hair, skin, clothes in under 20 words. Output raw text only, no intro.",
            analyzeAreaPrompt: `Act as an AI architectural photographer and Prompt Engineer. Your task is to analyze an image (cropped from a larger one) to write a single, highly detailed description prompt for an image generator.
STRUCTURE REQUIREMENT: "góc chụp cận cảnh tập trung vào chi tiết của [đối tượng], [đặc điểm của đối tượng đó (cụ thể, chất liệu, bề mặt vật liệu sắc nét, độ nhám, phản xạ)], [điều kiện ánh sáng và bóng đổ]".
LENGTH REQUIREMENT: The response MUST be between 30 and 50 Vietnamese words.
BEHAVIOR: Focus on describing small details that are currently blurry in the source. Describe textures as if you are seeing them in 8k resolution. Do not add any introductory text.`,
            applyLighting: 'You are a professional lighting and architectural rendering expert. The user has provided an image and wants to completely change its lighting scenario. Your task is to re-render this image with the new lighting conditions described below. **CRITICAL**: You must preserve 100% of the original image\'s architectural form, materials, and composition. Only change the lighting, shadows, and overall atmosphere of the scene. The desired lighting scenario is: "{0}".',
            classifyImageTypePrompt: 'Is this an image of an interior or exterior space? Answer with only one word: \'interior\' or \'exterior\'.',
            generateInteriorVariation: `You are a professional Interior Architect. You are provided with a reference image representing style, colors, and materials. Your task is to imagine and draw a different space in the same house.
MANDATORY REQUIREMENTS:
- PRESERVE the Design Style (e.g., Japandi, Industrial, Neoclassical...).
- PRESERVE the Core Color Palette (e.g., Walnut Wood + Tan Leather + Concrete Gray).
- PRESERVE Material characteristics (gloss, roughness, wood grain).
- SPACE TO CREATE: "{0}".
{1}
Create a professional architectural photograph, realistic, 8k, soft natural daylight.`,
            generateArchitectureVariation: `You are a professional Architect. You are provided with a reference architectural image representing 100% of the actual forms and details. Your task is to redraw a specific architectural view (close-up or artistic) from this structure.
MANDATORY REQUIREMENTS:
- PRESERVE 100% of all architectural details, forms, materials, and structural elements from the source image.
- ABSOLUTELY DO NOT invent, add new structural details, or change components that are not present in the original reference.
- For CLOSE-UP and ARTISTIC views: You MUST only focus on existing elements of the original building. Do not use imaginary details or interpolated structures.
- You are only allowed to change the camera angle, lens focal length, and lighting conditions to create a professional architectural photograph.
- VIEW TO CREATE: "{0}".
{1}
The final output must be a realistic 8k photograph with absolute fidelity to the original building's details.`,
            generateArchToInterior: `You are a world-class Architect and Interior Designer. You are given an EXTERIOR photo of a building. Your task is to design and render the INTERIOR spaces for this building.
MANDATORY REQUIREMENTS:
- STYLISTIC CONSISTENCY: The interior MUST perfectly match the exterior architectural language (e.g., if the building is brutalist concrete, the interior should be raw brutalist).
- WINDOW SYSTEMS: If the interior space has windows, the frame design, glazing type, and proportions MUST match the window systems visible in the architectural photo.
- MATERIALS: Carry over the material palette and textures from the exterior to the interior.
- SPACE TO CREATE: "{0}".
{1}
The output must be a professional 8k interior architectural photograph with hyper-realistic natural lighting.`,
            generateInteriorDetailVariation: `You are a professional interior photographer and Interior Architect. You are provided with an interior space image. Your task is to redraw a CLOSE-UP or ARTISTIC view focusing on loose furniture, material details, or decor from this space.
MANDATORY REQUIREMENTS:
- PRESERVE 100% of the style, colors, and material properties from the reference image.
- ABSOLUTELY DO NOT add new furniture or items not present in the original image. Only focus on what is already there.
- Focus on showing material surfaces with extreme sharpness (wood grain, fabric texture, metal sheen).
- Use professional photography techniques: bokeh (blurred background), dramatic lighting, macro shots.
- VIEW TO CREATE: "{0}".
The result must be a realistic 8k photograph, absolutely sharp, with high artistic value.`,
            syncViewPrompt: `You are a professional AI Rendering specialist. You are provided with 2 images.
IMAGE 1: Reference View (Style Reference). Analyze and memorize: dominant colors, materials, lighting (direction, color temperature, contrast), context (environment), and overall design language.
IMAGE 2: View to Sync (Source Geometry).
TASK: Redraw IMAGE 2 so that:
1. IT PRESERVES 100% of the camera angle, architectural forms, and existing details from IMAGE 2.
2. IT APPLIES ALL color palettes, materials, lighting scenarios, and atmospheric context from IMAGE 1.
The result must be a realistic 8k photograph, highly consistent with the style of the Reference View.`,
            lightingSimulationPrompt: `You are a lighting and architectural visualization specialist. You are provided with 2 images.
IMAGE 1: Mood and Style Sample (Mood Reference). Analyze: lighting setup, color grading, contrast, and rendering style (e.g., photorealistic, sketchy, watercolor, cinematic).
IMAGE 2: Existing View (Base Image).
TASK: Redraw IMAGE 2 so that:
1. IT PRESERVES 100% of the architectural form, the specific materials (textures), geometry, and camera angle from IMAGE 2. ABSOLUTELY DO NOT change materials or add new objects.
2. IT COMPLETELY TRANSFORMS the lighting mood and visual style to match IMAGE 1.
The result must be a visualization that perfectly captures the atmosphere and presentation style of the reference while being content-identical to the source.`,
            constructionMessy: `You are an architectural AI editor. Recreate this building photo at its initial messy rough state.
REQUIREMENTS:
- PRESERVE 100% of the environment, sky, and camera angle.
- REPLACE the main structure with a messy construction site: loose dirt, stones, debris, scattered construction materials like bricks and wood. 
- Create a feeling of a raw site before construction begins.`,
            constructionCleaned: `You are an architectural AI editor. Recreate this building photo at the site-preparation stage.
REQUIREMENTS:
- PRESERVE 100% of the environment and camera angle.
- REPLACE the main structure with a leveled, cleaned ground plot. 
- Add a temporary construction fence (blue or green corrugated metal). The site should look organized and ready for foundation work.`,
            constructionRough: `You are an architectural AI editor. Recreate this building at the ROUGH STRUCTURE stage.
REQUIREMENTS:
- PRESERVE 100% of the architectural forms, window positions, and camera angle.
- REPLACE all finishes with ROUGH materials: unplastered red brick walls, exposed grey concrete columns and beams. 
- No paint, no glass, no railings. Add some scaffolding. 
- The result must look like a building frame under construction.`,
            constructionFinishing: `You are an architectural AI editor. Recreate this building at the BASIC FINISHING stage.
REQUIREMENTS:
- PRESERVE 100% of the architectural forms and camera angle.
- BUILDING: Walls should be plastered and painted as per the design. Window frames and glass must be installed.
- EXTERIOR: The yard and garden areas should still be empty concrete or dirt. No plants, no decorative gates or landscape elements yet.
- It should look like the shell is finished but the landscaping hasn't started.`,
            constructionLandscape: `You are an architectural AI editor. Recreate this building at the FULL COMPLETION stage with lush landscaping.
REQUIREMENTS:
- PRESERVE the finished building as in the original.
- ADD ALL landscape elements: stone-paved paths, lush green grass, flower beds, mature trees, garden lighting, and an aesthetic perimeter fence/gate.
- Result in a realistic architectural photograph showing the building in its best use state.`,
            watercolorSketchPrompt: `Act as a master architectural illustrator. Convert the provided image into a professional hand-drawn watercolor sketch. 
MANDATORY REQUIREMENTS: 
1. Preserve 100% of the architectural geometry, proportions, and structural details from the original image. 
2. Retain the original color palette exactly. 
3. Render with sharp ink/pencil hand-drawn lines combined with artistic watercolor bleed effects on high-quality textured paper. 
The output must be a hyper-realistic, highly detailed, and emotionally evocative architectural sketch.`,
            interiorViewWithCharacter: "ADD CHARACTER: Naturaly include the character from the second image in the space. The character should {action}. Ensure the clothing and appearance match the provided character image.",
            architectureViewWithCharacter: "ADD CHARACTER: Naturaly include the character from the second image in the architectural scene (e.g., walking in front of the lobby, standing on a balcony, or strolling in the garden). Ensure consistent clothing and appearance.",
            generateFromImageInterior: `Hãy đóng vai một chuyên gia thiết kế nội thất with 20 năm kinh nghiệm and chuyên gia dựng hình 3D. Từ ảnh 3D/phác thảo được cung cấp, hãy viết một prompt chi tiết dưới 100 từ theo cấu trúc sau, bổ sung yếu tố điện ảnh/nhiếp ảnh:
- Ảnh chụp thực tế của [phòng], phong cách thiết kế, mô tả kỹ về vật liệu, tính chất vật liệu của đối tượng chính.
- Ánh sáng: Mô tả rõ ràng về ánh sáng (ví dụ: Ánh sáng Volumetric God Rays, Golden Hour, Ánh sáng Low-Key), góc máy (Wide Shot, Low Angle).
- hãy lựa chọn ánh sáng làm sao để kết quả ảnh đầu ra giống ảnh chụp thực tế nhất.
- Mô tả góc camera đúng with góc camera ảnh tải lên.

Câu lệnh mẫu: Ảnh chụp thực tế của phòng khách, phong cách hiện đại sang trọng. Vật liệu hiển thị rõ nét: sofa vải nỉ dệt thô có độ xù bề mặt, bàn đá Marble trắng vân mây bóng mờ, sàn gỗ óc chó lát xương cá ấm áp. Ánh sáng tự nhiên (Soft Daylight) chiếu xiên tạo hiệu ứng Volumetric nhẹ, làm nổi bật hạt bụi không khí and texture vật liệu. Ánh sáng Fill Light dịu nhẹ làm sáng vùng tối. Góc máy Wide Shot 24mm, Eye-Level, góc nhìn chính diện bao quát không gian. Ảnh 8k, phong cách nhiếp ảnh kiến trúc, siêu thực.

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.`,
            generateFromKeywordsInterior: 'Act as an expert interior designer and 3D rendering specialist. From the user-provided keywords about an interior space, write a detailed prompt under 100 words focusing on these elements:\n- The design style based on the keywords.\n- Describe in detail, emphasizing the realism of materials (e.g., natural oak wood grain, matte marble surface, slightly textured sofa fabric).\n- Describe the lighting: Always use soft, gentle, natural daylight coming through a window, creating a soft feeling with no harsh shadows.\n- Describe a suitable camera angle.\n- Prohibitions: Absolutely do not describe any outside context (e.g., city view, garden...).\n\nUser\'s keywords: "{0}"\n\nImportant: Only return the content of the prompt, without any introductory phrases or sentences.',
            generateWithReference: 'The user\'s prompt is: "{0}". As an AI architectural renderer, your task is to combine a structural sketch with a style reference. The first image is the structural sketch. The second image is a reference for style, lighting, scenery, and materials. You must apply the mood, lighting, color palette, materials, and surrounding scenery from the second image to the building from the first sketch. It is forbidden to copy the main architectural building shape from the second style-reference image, but you should adopt its overall environment and textures. The final render must be an exterior shot based on the user\'s prompt.',
            generateWithReferenceNegative: 'The user\'s prompt is: "{0}". As an AI architectural renderer, your task is to combine a structural sketch with a style reference. The first image is the structural sketch. The second image is a reference for style, lighting, scenery, and materials. You must apply the mood, lighting, color palette, materials, and surrounding scenery from the second image to the building from the first sketch. It is forbidden to copy the main architectural building shape from the second style-reference image, but you should adopt its overall environment and textures. The final render must be an exterior shot based on the user\'s prompt. CRITICAL: The user has specified things to AVOID. You MUST NOT include any of the following elements in the image: "{1}".',
            generateWithoutReference: 'The user\'s prompt is: "{0}". You are creating a realistic architectural render. The provided image is the absolute structural reference (do not treat as a sketch). Generate a photorealistic image based on this source and the user\'s prompt.',
            generateWithoutReferenceNegative: 'The user\'s prompt is: "{0}". You are creating a realistic architectural render. The provided image is the absolute structural reference (do not treat as a sketch). Generate a photorealistic image based on this source and the user\'s prompt. CRITICAL: The user has specified things to AVOID. You MUST NOT include any of the following elements in the image: "{1}".',
            generateFromImage: `(Vai trò:
bạn là một chuyên gia thiết kế nội thất và kiến trúc với 20 năm kinh nghiệm đồng thời bạn còn là 1 chuyên gia tạo ảnh bằng AI trong lĩnh vực kiến trúc và nội thất.

Kỹ năng:
- Bạn am hiểu về các kỹ thuật chụp ảnh kiến trúc nội thất cảnh quan.
- Am hiểu về bố cục, ánh sáng, góc camera
- Nghiên cứu sâu các kỹ thuật viết Prompt tạo ảnh bằng gemini

Nhiệm vụ:
Từ ảnh 3D/phác thảo được cung cấp, hãy viết một prompt chi tiết dưới 150 từ theo cấu trúc sau, bổ sung yếu tố điện ảnh/nhiếp ảnh:
Ảnh chụp thực tế của [dạng công trình], phong cách thiết kế, mô tả kỹ về hình khối, vật liệu, tính chất vật liệu của đối tượng chính, bối ảnh phù hợp, ánh sáng, góc camera và chỉ số máy ảnh phù hợp.

Quy định:
- Hình khối , vật liệu, tính chất phải mô tả đúng với ảnh tải lên không được sáng tạo sai.
- Bối cảnh sáng tạo 1 bối cảnh phù hợp với công trình và ưu tiên các bối cảnh ở việt nam.
- ánh sáng lựa chọn 1 thời điểm ánh sáng phù hợp và làm nổi bật công trình kèm mood.
- góc camera: góc camera dựa theo ảnh tải lên
- mô tả ánh sáng và bối cảnh để ảnh kết quả giống với chụp thực tế ở việt nam nhất và tuyệt đối không có dây điện biển bảng quảng cáo.

Ví dụ:
"Ảnh chụp kiến trúc thực tế của biệt thự Tân Cổ Điển.
Mái ngói đen nhám, hệ lam gỗ dọc tinh tế, tường ốp đá chẻ thô mộc và ban công tràn ngập cây xanh nhiệt đới.

Bối cảnh khu phố yên tĩnh ở Việt Nam, sạch sẽ, đường nhựa phẳng, vỉa hè lát đá tối màu, không có người, không dây điện rối.Hai bên trồng cây bụi nhiệt đới dày lá to xanh đậm chạy ngang, kết hợp chuối cảnh/cau/cọ.

ánh sáng:Ánh nắng ban ngày lúc 10h sáng, trời xanh trong, bóng đổ của cây và lam tạo pattern rõ trên tường nhưng mềm vừa, tổng thể sang – sạch – yên bình.

Góc máy Wide Shot, thể hiện góc nhìn từ dưới lên."
Prompt ví dụ chỉ mang tính chất tham khảo về cấu trúc chứ không phải dựa theo y hệt.

Quan trọng: Chỉ trả về nội dung của prompt, không thêm bất kỳ lời dẫn hay câu giới thiệu nào.và sau prompt có thêm cụm: giữ nguyên chi tiết gốc ảnh tải lên).`,
            generateFromKeywords: 'Act as an expert in interior design and architecture with 20 years of experience and a 3D rendering specialist. From the user-provided keywords, write a detailed prompt under 100 words with the following structure, adding cinematic/photographic elements:\n- Realistic photo of [type of building], design style, detailed description of materials, material properties of the main object.\n- Creatively invent the surrounding scenery and context based on the keywords.\n- Lighting: Clearly describe the lighting (e.g., Volumetric God Rays, Golden Hour, Low-Key lighting), camera angle (Wide Shot, Low Angle), and Depth of Field.\n- Prioritize Vietnamese contexts; choose the scenery and lighting so that the output image\'s context and lighting most resemble a realistic photo taken in Vietnam.\n- Describe a suitable camera angle.\n\nUser\'s keywords: "{0}"\n\nExample: If the user enters "neoclassical villa, saigon", you could write: "Realistic architectural photo of a Neoclassical villa. Cream-colored philosopher\'s stone walls, black wrought-iron balcony. Context: A downtown Saigon street, with electrical/cable wires and urban greenery. 10 AM sunlight (harsh, high-intensity) shines directly from above, creating sharp shadows. Wide Shot camera angle, view from below."\n\nImportant: Only return the content of the prompt, without any introductory phrases or sentences.',
            editWithReference: `**CRITICAL INPAINTING DIRECTIVE WITH STYLE REFERENCE**
You are provided with 3 inputs: Original Image, Mask (White=Edit), and Style Reference.
Task: Completely replace content in the White masked area to match the user request: "{0}".
- Use the Style Reference for materials/lighting/vibe.
- PRESERVE the Black masked area exactly.
- Ensure seamless blending.`,
            editWithoutReference: `**INPAINTING GENERATION**
Input: Original Image + Mask (White = Edit, Black = Keep).
Task: Completely replace the content in the White masked area to match this description: "{0}".
Constraints:
- The Black area must be preserved 100%.
- The new content must fit the perspective and lighting of the original image.
- Make it realistic and high quality.`,
            smartEditPrompt: `**SMART LOCALIZED INPAINTING**
You are working on a high-resolution localized crop of an image. Your task is to redraw the MASKED area (white) with extreme detail and realism based on this description: "{0}".
REQUIREMENTS:
- Only change what is inside the MASK area.
- Preserve the existing composition and perspective of the surrounding area within the crop.
- The result must blend seamlessly with existing lighting and materials.
- Hyper-realistic detail, pixel-perfect sharp output.`,
            materialReplacementPrompt: `**CRITICAL MATERIAL REPLACEMENT DIRECTIVE**
You are a professional architectural renderer and material specialist.
TASK: Replace the material in the red-masked area of Image 1 using the material from Image 2 as a base.

**MANDATORY REQUIREMENTS FOR TILE SIZE AND SCALE**:
1. **ABSOLUTE PRECISION ON TILE SIZE**: The user has specified a tile size: "{0}". You MUST render the tiles with these exact proportions relative to the architectural elements in the scene. If the size is 60x60cm, ensure the grid is perfectly square and sized correctly for the wall/floor.
2. **STRICT SCALE ADHERENCE**: The user has specified a scale factor: "{1}". This multiplier MUST be applied to the material texture. A scale of 1.0x means standard size; 0.5x means the texture/tiles are twice as small (more tiles); 2.0x means the texture/tiles are twice as large (fewer tiles).
3. **PATTERN FIDELITY**: If a pattern is specified ("{2}"), apply it with geometric perfection (e.g., Herringbone, Stretcher bond).
4. **MATERIAL PROPERTIES**: Apply the specified property ("{3}") with high-fidelity reflections and surface roughness (e.g., Glossy, Matte, Lappato).
5. **GEOMETRY PRESERVATION**: Keep 100% of the architectural form and lighting from Image 1. Only change the surface material within the mask.

**MATERIAL DESCRIPTION**: {4}

Result: A hyper-realistic 8k architectural photograph with mathematically accurate tile sizes and scale.`,
            placeAndRenderFurniture: `
**CRITICAL PHOTOREALISTIC COMPOSITION TASK: ABSOLUTE SCALE PRESERVATION**

You are a master AI of optical art and photorealistic composition. Your task is to seamlessly integrate one or more objects into a background image while STRICTLY ADHERING to the user's layout.

**Inputs:**
1.  **Background Image**: The main scene.
2.  **Object(s) Image(s)**: Subsequent PNG images (with transparency) to be placed into the background.
3.  **Placement Data (JSON)**: Contains the non-negotiable coordinates, scale, and rotation.

**MANDATORY REQUIREMENTS (FAIL IF IGNORED):**
1.  **STRICT COORDINATES & SCALE**: You MUST place the center of each object exactly at the provided \`pos\` coordinates. You MUST render the object at the exact \`scale\` (percentage of background width) specified. DO NOT "intelligently" resize or move objects. The user's placement is the absolute ground truth.
2.  **PHOTOREALISTIC HARMONIZATION**: While scale/pos are fixed, you must adjust the LIGHTING, SHADOWS, and REFLECTIONS to make the object look like it truly exists in the scene.
    - Match the background's light source direction and temperature.
    - Cast soft, realistic contact shadows on the floor/surfaces below the objects.
    - Ensure the object receives environmental reflections from the background.
3.  **EDGE BLENDING**: Perform pixel-perfect blending at the edges of the objects to remove any traces of "pasting" or "cut-out" appearance. Ensure consistent grain and sharpness.
4.  **PERSPECTIVE WARPING**: You may subtly warp the object's geometry to match the background's vanishing points, but ONLY if it does not change the perceived 2D position or footprint scale set by the user.

**Placement Data:**
\`\`\`json
{0}
\`\`\`
`,
            generateArchitecturalPrompts: 'Act as a professional photographer with over 20 years of experience in architectural, interior, landscape, planning, and resort photography, having won numerous international photography awards.\n\nYou are also an expert Prompt Engineer & AI Visual Prompt Designer, with a deep understanding of image description language, visual composition, lighting, space, scale, and emotional impact as seen in leading architectural magazines like ArchDaily, Dezeen, Architectural Digest, Wallpaper, Dwell…\n\nI will upload an image of a building (architecture or interior). Imagine you are actually in that space with a professional camera (Canon R5 or Nikon Z9, with a tilt-shift lens and wide-angle to telephoto lenses as needed).\n\nOPTIONAL INPUT: Character Description: {0}.\nREQUIREMENT: If a character description is provided, replace generic words like "person" or "people" in groups (2) Medium Shots and (4) Artistic Shots with this specific description.\n\nBased on your international photography experience and the visual style of contemporary architectural magazines, analyze the uploaded image and propose 20 of the most impressive artistic shots of this building.\n\nEach shot should be written as an image generation prompt for the "Nano Banana" AI, specifically describing the camera angle, lighting, weather, composition, lens, and emotional feel of the image. Do not use JSON format.\n\nClearly divide the prompts into 4 basic groups as follows:\n\n1️⃣ 5 wide shots\n• Describe the overall building and its surrounding landscape.\n• Each shot should have a different lighting and weather effect: dawn, midday, sunset, night, rain, or early morning fog.\n• Specify the direction of light, camera angle (e.g., high-angle, eye-level, 45-degree angle, from the entrance…).\n\n2️⃣ 5 medium shots\n• Focus on the relationship between the space and people. Each shot MUST include a human element (use the character description if provided, e.g., reading, walking, or interacting with the space).\n• Describe the composition, depth, lighting perspective, materials, shadows, and contrast.\n• Mandatory: People in the image must be active INSIDE the building (e.g., in the living room, lobby, corridor, balcony...), not standing on the street or far from the building.\n\n3️⃣ 5 detailed close-up shots\n• Focus on material textures, artistic structures, and subtle architectural highlights.\n• Could be door handle details, wood grain textures, metal joints, or lighting effects on special material surfaces.\n\n4️⃣ 5 artistic shots\n• Focus on main subjects like people (use the character description if provided), leaves, birds, or vehicles. The focused subject will occupy a large portion of the frame. The main building will be blurred in the background, creating a depth effect (separate foreground and background).\n\n🔴 SPECIAL ADDITION IF RESORT/PLANNING:\nIf you analyze the image as a Masterplan or Resort Overview, YOU MUST ADD a 5th group:\n\n5️⃣ 5 Specific Structure Descriptions\n• From the master plan, extract and imagine the detailed architecture of the 5 most important structures (e.g., Typical Villa, Clubhouse, Restaurant, Gate, Utility Area...).\n• Write a prompt to render a close-up view of that specific structure.\n• Describe clearly: Architecture, materials, mood, and immediate landscape.\n\nDetailed requirements for each shot:\n• Write in concise, evocative English.\n• Do not use JSON format, only text descriptions.\n• Prioritize emotional, visual, and photographic language (e.g., oblique light, leading lines, blurred foreground, deep background, tilt-shift lens perspective, dynamic composition, depth of field, cinematic tone…).\n• Goal: To authentically recreate the emotion, lighting, and art of photography – helping the "Nano Banana" AI to generate vivid, deep images with a professional, international magazine-style photographic quality.\nImportant: Only return the groups of shots as requested. Do not add any introductions, summaries, or conclusions.',
            generateFromPlan: 'From now on, you are an expert interior designer and a prompt engineer for AI image generators. You have advanced skills in layout, form, and architectural plan analysis. Your task is to analyze the uploaded 2D floor plan, identify the room type (e.g., Living Room, Master Bedroom), and determine the placement of key furniture from a front-facing view. Based on this, write a detailed prompt for a 3D rendering. The prompt must describe the furniture arrangement from a direct front view, without specifying colors or materials. The output must be only the prompt itself, starting with: "Create a direct front-view interior render of the space from the floor plan. It is a [Identified Room Type]. The view looks directly at... [Describe furniture placement]. Make it realistic as an architectural visualization."',
            analyzePlanStyle: 'Bạn là một chuyên gia diễn họa mặt bằng nội thất cho các căn hộ bds dạng đổ màu mặt bằng, mặt bằng 3d, và view mặt bằng cắt nóc. Bạn am hiểu về chuyên sâu về viết prompt tạo ảnh cho AI Gemini. Nhiệm vụ: Phân tích mẫu ảnh mặt bằng để nhận diện style (2D đổ màu, 3D top-down, ảnh chụp thực tế, hoặc 3D cắt nóc). Viết 01 Prompt tiếng Việt cho AI Nano Banana để tạo ảnh từ mặt bằng 2D sao cho giống style mẫu. CHỈ HIỂN THỊ PROMPT.',
            generateMoodboard: "As a professional interior designer, based on the image and theme provided by the user: '{0}'. Your task is to create a beautiful moodboard. The moodboard must include: a color palette extracted from the image, inspirational images fitting the theme, material samples (fabric, wood, metal), and related keywords. Arrange these elements in a clean, modern layout. The final output must be a single, cohesive moodboard image.",
            generateMoodboardWithReference: "As a professional designer, you are given 2 images and 1 theme. IMAGE 1 is the main inspiration for the **theme and subject**. IMAGE 2 is the reference for **style, color palette, and atmosphere**. The theme is: '{0}'. Your task is to create a beautiful moodboard combining both elements. The moodboard must include: a color palette extracted from the **style reference image**, inspirational images fitting the **theme from the main image**, material samples (fabric, wood, metal), and related keywords. Arrange these elements in a clean, modern layout. The final output must be a single, cohesive moodboard image.",
            extendView: 'You are an AI photo editing expert with "outpainting" capabilities. The user has provided an image with fuchsia pink (#FF00FF) areas on the borders. This is a "green screen" indicating the area to be drawn. Your task is to replace ALL of this pink area by seamlessly and logically continuing the content from the central image. You must maintain 100% of the original content in the center. The final result must be a complete image with no pink remaining.',
            changeStylePrompt: 'You are a luxury interior designer with 20+ years of experience, specializing in space transformation and international trends. Task: Analyze the spatial layout, lighting, materials, and furniture in the source image. Write one comprehensive prompt for AI Nano Banana to restyle the space into the requested style. Focus on: Core color palette, surface materials (wood, stone, metal, etc.), furniture form and details, and specific lighting mood. You are allowed to add or update furniture to match the style, as long as the original spatial footprint is preserved. CONSTRAINTS: Output ONLY the prompt. Do not explain or analyze. Ensure high realism and stylistic consistency. User request: "{0}"',
            generateFromPlanningImage: 'Role: Act as a Senior Architect and Planner with 20 years of experience and a professional prompt engineer for Gemini AI. Expertise: - Designing master plans for urban areas, parks, and resorts - Planning photography - Architectural visualization prompt engineering. Task: Analyze the uploaded planning image (type of planning, style, specific structures, appropriate context, and lighting) then write a complete image generation prompt to transform it into a photorealistic architectural photo. Structure: Realistic bird\'s-eye view master plan photo of [planning type], design style, [Items in the drawing]. Creatively invent context and surroundings. Lighting: Clearly describe lighting (e.g. Volumetric God Rays, Golden Hour, Low-Key), camera angle (Wide Shot, Low Angle). Prioritize Vietnamese contexts. Match the camera angle of the source. Output only the final prompt, no analysis, under 130 words.',
            generateVr360Prompt: `Bạn là một chuyên gia tạo ảnh Panorama 360 độ (VR 360). Nhiệm vụ của bạn là tạo một prompt mô tả không gian dưới dạng 'Equirectangular projection'. 
            Hình ảnh đầu ra PHẢI là một dải toàn cảnh rộng (tỷ lệ 2:1), bao quát trọn vẹn 360 độ quanh điểm đứng của camera. 
            Mép trái và mép phải của ảnh phải khớp nhau hoàn hảo để tạo thành một không gian liên tục không tì vết khi cuộn tròn.
            Hãy sử dụng các từ khóa chuyên môn như: "equirectangular projection", "360 degree panorama", "spherical projection", "VR view", "full sphere".
            Yêu cầu của người dùng là: "{0}".`,
            generateTextureMap: `You are a PBR Texture Expert for 3D Rendering. Task: Create the "{0}" map channel from this image.
CRITICAL REQUIREMENTS (MUST FOLLOW):
1. SEAMLESS TILING: The texture must be perfectly tileable horizontally and vertically WITHOUT VISIBLE SEAMS. Patterns on the edges must match perfectly.
2. DELIGHTING (REMOVE SHADOWS & LIGHTING): Completely remove all directional shadows and specular highlights. The texture must be FLAT, representing only the Albedo/Diffuse color of the material. No baked-in lighting.
3. PERSPECTIVE CORRECTION: Transform to a flat Orthographic view, removing any perspective distortion.

Map Definition for "{0}":
- Diffuse/Albedo: Flat color map, delighting, seamless.
- Normal: Normal map (purple/blue) showing surface details.
- Displacement: Height map (white=high, black=low).
- Roughness: Roughness map (white=rough, black=glossy).
- AO: Ambient Occlusion map.

Result: 1 high-quality square texture image, seamless and delighted.`,
            detectPerspectivePrompt: `Analyze this architectural photo and identify 4 points (top-left, top-right, bottom-right, bottom-left) that represent a rectangular plane in the real world (e.g., a building facade). 
            Return the coordinates as a JSON object: {"points": [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]}. 
            Coordinates must be in normalized range 0-1000. 
            Only return the JSON.`,
        },
        constants: {
            interiorLightingOptions: interiorLightingOptionsEn,
            exteriorLightingOptions: exteriorLightingOptionsEn,
            predefinedReferenceImages: {
                building: [
                    { name: 'Building Style 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092588730600_40c3acebfcd07f7ea9029c82ca948a59.jpg' },
                    { name: 'Building Style 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092588735695_52147b30644d6a42bec87f807661f7ff.jpg' },
                    { name: 'Building Style 3', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637645602_0a8bfc1046d9bfeeee62aac28d1afe87.jpg' },
                    { name: 'Building Style 4', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637644035_6298697cb54748adc10d86a43ebdfa7b.jpg' },
                    { name: 'Building Style 5', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUCAOTANG/main/z7092637643871_90807b3e08c2575e83dab45b46f94e87.jpg' },
                ],
                house: [],
                villa: [
                    { name: 'Villa Style 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUVILLA/main/z7092637643969_cd6b5c0e95120c877168f822520f18b7.jpg' },
                    { name: 'Villa Style 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/THAMCHIEUVILLA/main/z7092637649555_89ab81eea211c0448237820852b9a246.jpg' },
                ],
                'quy hoạch': [],
            },
            predefinedMaterialImages: {
                Vietceramics: [
                    { name: 'Tile 1', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/g%E1%BA%A1ch%20viet.png' },
                    { name: 'Tile 2', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/g%E1%BA%A1ch%20vi%E1%BB%87t%202.png' },
                    { name: 'Tile 3', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/magnifics_upscale-Lu5GdD9tveHqz5D5Usjd-download%20-%202025-11-10T130047.509.png' },
                    { name: 'Tile 4', url: 'https://raw.githubusercontent.com/Khanhltvpp1a/Media/main/magnifics_upscale-iXjSI9sXl1O3DpQwkvRI-download%20-%202025-11-10T125830.428.png' },
                ]
            },
            ASPECT_RATIO_LABELS: { auto: 'Auto', '1:1': 'Square (1:1)', '4:3': 'Landscape (4:3)', '3:4': 'Portrait (3:4)', '16:9': 'Wide (16:9)', '9:16': 'Story (9:16)', '2:3': 'Portrait (2:3)', '3:2': 'Landscape (3:2)' },
            stylePrompts: ["modern style", "minimalist style", "neoclassic style", "Indochine style", "industrial style", "Scandinavian style"],
            contextPrompts: ["on a Vietnamese street", "in a Vietnamese rural area", "in a luxury urban area, Vinhomes Hanoi", "at a Vietnamese T-junction", "in a tropical garden in rural Vietnam", "next to an asphalt road with green trees on both sides", "in a large European Garden with stone paths and sculptures", "at the foot of a majestic mountain with autumn foliage"],
            lightingPrompts: ["natural daylight, clear blue sky", "warm golden hour lighting, long shadows", "night time with moonlight and interior lighting", "overcast sky, soft light", "dawn with crisp morning air", "purple sunset with glowing windows", "heavy morning mist", "after rain, wet roads and light clouds"],
            cameraAnglePrompts: [{ display: "High angle shot", value: "high-angle shot"}, { display: "Low angle shot", value: "low-angle shot"}, { display: "3/4 view from left", value: "3/4 view from left"}, { display: "3/4 view from right", value: "3/4 view from right"}, { display: "Detailed close-up shot", value: "detailed close-up shot"}, { display: "Straight on symmetric shot", value: "straight on symmetric shot"}],
            planStylePrompts: ["modern style, white and wood", "minimalist style, smart furniture", "scandinavian style, natural lighting", "luxury style, premium materials", "Indochine style, blend of traditional and modern"],
            planRoomTypePrompts: ["bedroom", "living room", "kitchen", "dining room", "bathroom"],
            planColorizePrompts: ["Semi-realistic style", "Technical blueprint style", "Material Base style", "Marker Style", "Watercolor Style", "Photorealistic style"],
            videoPrompts: [{ display: "Day & Night Time-lapse", value: "Time-lapse of building from morning to night" }, { display: "Drone circle", value: "Flycam drone orbiting the building" }, { display: "Clouds time-lapse", value: "Clouds passing over on a sunny day" }, { display: "Light rain", value: "Building during a light rain shower with reflections" }, { display: "Zoom into entrance", value: "Slow zoom into the main entrance" }, { display: "Facade pan", value: "Camera panning across the facade from left to right" }],
            materialChangeOptions: [{ display: "Change floor material", value: "Replace floor in image 1 with material from image 2" }, { display: "Change rug", value: "Replace rug in image 1 with rug from image 2" }, { display: "Change curtains", value: "Replace curtains in image 1 with curtains from image 2" }],
            materialTypeOptions: materialTypeOptionsEn,
            tileSizeOptions: tileSizeOptionsEn,
            materialPropertyOptions: materialPropertyOptionsEn,
            tilePatternOptions: tilePatternOptionsEn,
            furnitureChangeOptions: [{ display: "Change sofa", value: "replace sofa in image 1 with sofa from image 2" }, { display: "Change chandelier", value: "replace chandelier in image 1 with chandelier from image 2" }, { display: "Change coffee table", value: "replace coffee table in image 1 with coffee table from image 2" }, { display: "Change TV unit", value: "replace TV unit in image 1 with TV unit from image 2" }, { display: "Change dining table", value: "replace dining table in image 1 with dining table from image 2" }, { display: "Change kitchen cabinet", value: "replace kitchen cabinet in image 1 with kitchen cabinet from image 2" }],
            interiorRoomTypes: ["Living Room", "Master Bedroom", "Kitchen & Dining", "Bathroom", "Home Office", "Worship Room", "Lobby"],
            interiorStyles: ["Modern", "Minimalism", "Scandinavian", "Indochine", "Neoclassical", "Wabi Sabi", "Luxury", "Industrial"],
            interiorLighting: ["Soft Natural Light", "Hard Sunlight & Shadows", "Warm Ambient Light", "Cinematic Mood Lighting", "Bright Studio Lighting", "Golden Hour Interior", "Night & Artificial Lights"],
            planningObjects: ["Urban Area", "Industrial Zone", "Tourism Area", "Rural Residential", "Theme Park", "Technical Infrastructure"],
            planningStyles: ["Modern", "Green City", "Smart City", "Sustainable", "Eco-Architecture", "Futuristic"],
            planningStructures: ["Single Villa", "Townhouse / Shophouse", "High-rise Building", "Commercial Center", "School", "Green Park", "Lake", "Cafe", "Bungalow", "Central Square", "Overpass"],
            planningContexts: ["Surrounded by fields and villages", "Surrounded by urban and traffic", "Surrounded by mountains and valleys", "Surrounded by parks and lakes", "Surrounded by coast and resort", "Surrounded by high-tech zone"],
            planningLightings: ["Early Morning", "Bright Daylight", "Golden Hour", "Purple Sunset", "Urban Night", "Overcast", "Misty Morning"]
        }
    }
};
