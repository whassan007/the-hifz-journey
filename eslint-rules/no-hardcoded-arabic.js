export default {
  create(context) {
    const PERMITTED_FILES = [
      "surah-ground-truth.json",
      "surah-validation-report.json"
    ];

    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        const hasArabic = /[\u0600-\u06FF]/.test(node.value);
        if (!hasArabic) return;

        const filename = context.getFilename();
        const isPermitted = PERMITTED_FILES.some(f => filename.endsWith(f));
        if (!isPermitted) {
          context.report({
            node,
            message: `Hardcoded Arabic text found: "${node.value}". All Quranic content must come from surah-ground-truth.json via the data layer. Never type verse text in source code.`
          });
        }
      }
    };
  }
};
