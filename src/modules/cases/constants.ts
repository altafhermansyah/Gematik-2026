import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

const defaultMessages = getMessages(DEFAULT_LOCALE);

/**
 * @deprecated Use getMessages(locale).cases.sections instead.
 */
export const CASE_SECTION_TITLES = defaultMessages.cases.sections;

/**
 * @deprecated Use getMessages(locale).common.backToAtlas instead.
 */
export const BACK_TO_ATLAS_LABEL = defaultMessages.common.backToAtlas;
