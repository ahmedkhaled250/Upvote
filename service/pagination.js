export default function pagination(page, size) {
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 2;
  }
  const skip = (page - 1) * size;
  return { limit: size, skip };
}
