package fit.iuh.edu.fashion.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Tiện ích xử lý text dùng chung cho các service AI.
 */
public final class TextUtils {

    private TextUtils() {
        // Utility class
    }

    /**
     * Kiểm tra chuỗi text có chứa bất kỳ từ khóa nào không.
     */
    public static boolean containsAny(String text, String... keywords) {
        if (text == null) return false;
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Chuẩn hóa tiếng Việt — bỏ dấu, lowercase.
     */
    public static String normalizeVietnamese(String text) {
        if (text == null) return "";
        String result = text.toLowerCase();
        result = result.replaceAll("[áàảãạăắằẳẵặâấầẩẫậ]", "a");
        result = result.replaceAll("[éèẻẽẹêếềểễệ]", "e");
        result = result.replaceAll("[íìỉĩị]", "i");
        result = result.replaceAll("[óòỏõọôốồổỗộơớờởỡợ]", "o");
        result = result.replaceAll("[úùủũụưứừửữự]", "u");
        result = result.replaceAll("[ýỳỷỹỵ]", "y");
        result = result.replace("đ", "d");
        return result;
    }

    /**
     * Format giá tiền VND.
     */
    public static String formatVnd(long amount) {
        return String.format("%,d VND", amount);
    }

    // ============= VIETNAMESE TEXT FIX — tách từ bị dính liền =============

    /** Regex phát hiện chữ thường (hoặc chữ có dấu VN) dính liền chữ HOA */
    private static final Pattern LOWER_UPPER_STUCK = Pattern.compile(
            "([a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ])" +
            "([A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ])"
    );

    /** Nguyên âm tiếng Việt (đủ dấu, upper + lower) */
    private static final String VN_VOWELS =
            "aàáảãạăắằẳẵặâấầẩẫậeèéẻẽẹêếềểễệiìíỉĩịoòóỏõọôốồổỗộơớờởỡợuùúủũụưứừửữựyỳýỷỹỵ" +
            "AÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬEÈÉẺẼẸÊẾỀỂỄỆIÌÍỈĨỊOÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢUÙÚỦŨỤƯỨỪỬỮỰYỲÝỶỸỴ";
    private static final String VN_VOWEL_CLASS = "[" + VN_VOWELS + "]";

    /** Phụ âm đầu tiếng Việt (ghép trước, đơn sau) */
    private static final String VN_INITIAL_CONSONANT =
            "(?:ngh|ng|nh|gh|gi|ch|kh|ph|th|tr|qu|b|c|d|đ|g|h|k|l|m|n|p|r|s|t|v|x)";

    /** Phụ âm cuối tiếng Việt — bao gồm cả ghép (ch, ng, nh) và đơn */
    private static final String VN_FINAL_CONSONANT = "(?:ch|ng|nh|[nmctpk])";

    /**
     * Pattern tách âm tiết VN bị dính.
     * Group1: nguyên âm + phụ âm cuối (BẮT BUỘC có phụ âm cuối để tránh false positive).
     * Group2: phụ âm đầu + nguyên âm (âm tiết tiếp theo).
     *
     * VD: "khachhang" → (ach)(hang) → "khach hang" ✅
     *     "cửahàng"  → (ửa)(hà)   → "cửa hàng"   ✅  (a đóng vai trò kết thúc nguyên âm kép)
     *     "chitiết"  → KHÔNG match (i)(ti) vì yêu cầu final consonant
     *
     * Để xử lý trường hợp nguyên âm kép (ửa, iê, ươ...) kết thúc âm tiết:
     * Pattern bổ sung SYLLABLE_BREAK_VOWEL cho trường hợp 2+ nguyên âm liên tiếp rồi gặp phụ âm đầu.
     */
    private static final Pattern SYLLABLE_BREAK_WITH_FINAL = Pattern.compile(
            "(" + VN_VOWEL_CLASS + "+" + VN_FINAL_CONSONANT + ")" +
            "(" + VN_INITIAL_CONSONANT + VN_VOWEL_CLASS + ")",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Pattern tách khi nguyên âm kép/dài (2+ nguyên âm) gặp phụ âm đầu.
     * VD: "cửahàng" → (ửa)(hà) ✅, "Dựatrên" → (ựa)(trê) ✅
     */
    private static final Pattern SYLLABLE_BREAK_MULTI_VOWEL = Pattern.compile(
            "(" + VN_VOWEL_CLASS + "{2,})" +
            "(" + VN_INITIAL_CONSONANT + VN_VOWEL_CLASS + ")",
            Pattern.CASE_INSENSITIVE
    );

    /** Ký tự VN có dấu — dùng trong pattern */
    private static final String VN_DIAC_VOWELS =
            "àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ" +
            "ÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ";

    /**
     * Pattern3a: Nguyên âm CÓ DẤU + phụ âm đầu + bất kỳ nguyên âm.
     * VD: "sơmi" → (ơ)(mi) → "sơ mi" ✅ (group1 ơ có dấu)
     *     "đẹpmắt" → (ẹp matched by P1) → handled by Pattern1
     */
    private static final Pattern SYLLABLE_BREAK_OPEN_A = Pattern.compile(
            "([" + VN_DIAC_VOWELS + "])" +
            "(" + VN_INITIAL_CONSONANT + VN_VOWEL_CLASS + ")",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Pattern3b: Bất kỳ nguyên âm + phụ âm đầu + nguyên âm CÓ DẤU.
     * VD: "chitiết" → (i)(tiế) → "chi tiết" ✅ (group2 tiế có dấu)
     *     "active" → KHÔNG match (group2 ti không có dấu VN)
     */
    private static final Pattern SYLLABLE_BREAK_OPEN_B = Pattern.compile(
            "(" + VN_VOWEL_CLASS + ")" +
            "(" + VN_INITIAL_CONSONANT + "[" + VN_DIAC_VOWELS + "])",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Sửa text tiếng Việt bị dính từ — ví dụ AI model nhỏ hay tạo ra.
     * <p>
     * "ÁothunpolongắntayJacquard" → "Áo thun polo ngắn tay Jacquard"
     * "Dựatrên" → "Dựa trên"
     * "cửahàng" → "cửa hàng"
     * <p>
     * Chiến lược:
     * 1. Tách tại chuyển tiếp chữ-thường → chữ-HOA (camelCase kiểu VN)
     * 2. Tách âm tiết VN bị dính trên TOÀN BỘ text (không cần threshold)
     * 3. Bảo vệ URLs, markdown links, paths khỏi bị tách
     */
    public static String fixStuckVietnameseWords(String text) {
        if (text == null || text.isEmpty()) return text;

        // Bước 1: Tách tại ranh giới chữ-thường → chữ-HOA
        String result = LOWER_UPPER_STUCK.matcher(text).replaceAll("$1 $2");

        // Bước 2: Tách âm tiết VN bị dính — áp dụng trên toàn bộ text
        // Nhưng bảo vệ URLs, markdown links, code blocks
        result = splitWithProtection(result);

        // Bước 3: Dọn double spaces
        result = result.replaceAll(" {2,}", " ");

        return result;
    }

    /**
     * Tách âm tiết VN nhưng bảo vệ URLs, markdown links, code blocks, slugs.
     */
    private static String splitWithProtection(String text) {
        // Bảo vệ các pattern KHÔNG nên tách:
        Pattern protectedPattern = Pattern.compile(
                "https?://\\S+" +               // URLs
                "|\\[[^\\]]*\\]\\([^)]*\\)" +   // Markdown links [text](url)
                "|\\([^)]*\\)" +                // Nội dung trong ngoặc tròn (url, path, code...)
                "|[a-zA-Z0-9]+-[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+" + // Slug: word-word-word (3+ segments)
                "|/[a-zA-Z0-9/_.-]+" +          // Paths /products/slug.ext
                "|`[^`]+`" +                     // Inline code
                "|<[^>]+>" +                     // HTML tags
                "|\\*\\*[^*]+\\*\\*" +           // Bold **text**
                "|\\d[\\d.,]+\\s*(?:VND|₫|đ)"   // Prices 350,000 VND
        );

        StringBuilder sb = new StringBuilder();
        Matcher protectedMatcher = protectedPattern.matcher(text);
        int lastEnd = 0;

        while (protectedMatcher.find()) {
            if (protectedMatcher.start() > lastEnd) {
                String unprotected = text.substring(lastEnd, protectedMatcher.start());
                sb.append(applySyllableBreak(unprotected));
            }
            sb.append(protectedMatcher.group());
            lastEnd = protectedMatcher.end();
        }

        if (lastEnd < text.length()) {
            sb.append(applySyllableBreak(text.substring(lastEnd)));
        }

        return sb.toString();
    }

    /** Pattern phát hiện ký tự VN có dấu (không phải ASCII thuần) */
    private static final Pattern HAS_VN_DIACRITICS = Pattern.compile(
            "[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ" +
            "ÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]"
    );

    /**
     * Áp dụng syllable break regex lặp lại trên text thuần (không có URL/link).
     * Skip text ngắn pure-ASCII (< 6 chars, likely English: polo, fit, etc.).
     * Luôn xử lý text dài hoặc text có ký tự VN.
     */
    private static String applySyllableBreak(String text) {
        if (text == null || text.length() < 4) return text;

        // Tách từng "word" (cụm liền không có space), chỉ break word dài
        // Short pure-ASCII words (polo, active, fit) → skip
        // Long words or words with VN chars → break
        StringBuilder result = new StringBuilder();
        int i = 0;
        while (i < text.length()) {
            // Tìm cụm ký tự liền (không phải space/punctuation)
            if (Character.isLetterOrDigit(text.charAt(i))) {
                int start = i;
                while (i < text.length() && Character.isLetterOrDigit(text.charAt(i))) i++;
                String word = text.substring(start, i);
                if (shouldBreakWord(word)) {
                    result.append(breakWord(word));
                } else {
                    result.append(word);
                }
            } else {
                result.append(text.charAt(i));
                i++;
            }
        }
        return result.toString();
    }

    /** Quyết định có nên tách word hay không */
    private static boolean shouldBreakWord(String word) {
        // Có ký tự VN có dấu → luôn tách bất kể độ dài (sơmi→sơ mi, đẹplắm→đẹp lắm)
        if (HAS_VN_DIACRITICS.matcher(word).find()) return true;
        // Pure ASCII → cần threshold cao hơn vì nhiều từ tiếng Anh (active, jacquard, training...)
        // Chỉ tách khi >= 10 chars — lúc đó gần như chắc chắn là VN bị dính (khachhang, sanphamdep)
        if (word.length() < 10) return false;
        return SYLLABLE_BREAK_WITH_FINAL.matcher(word).find()
            || SYLLABLE_BREAK_MULTI_VOWEL.matcher(word).find();
    }

    /** Tách 1 word bằng syllable break — dùng 4 pattern */
    private static String breakWord(String word) {
        String r = word;
        String prev;
        int maxIter = 20;
        do {
            prev = r;
            // P1: vowel + FINAL CONSONANT + initial + vowel (khachhang → khach hang)
            r = SYLLABLE_BREAK_WITH_FINAL.matcher(r).replaceAll("$1 $2");
            // P2: MULTI VOWEL + initial + vowel (cửahàng → cửa hàng)
            r = SYLLABLE_BREAK_MULTI_VOWEL.matcher(r).replaceAll("$1 $2");
            // P3a: DIACRITIZED vowel + initial + any vowel (sơmi → sơ mi)
            r = SYLLABLE_BREAK_OPEN_A.matcher(r).replaceAll("$1 $2");
            // P3b: any vowel + initial + DIACRITIZED vowel (chitiết → chi tiết)
            r = SYLLABLE_BREAK_OPEN_B.matcher(r).replaceAll("$1 $2");
            maxIter--;
        } while (!r.equals(prev) && maxIter > 0);
        return r;
    }
}
