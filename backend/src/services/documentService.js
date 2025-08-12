const documents = [];

exports.saveDocument = (file) => {
  const id = documents.length + 1;
  documents.push({ id, name: file.originalname, path: file.path });
  return id;
};