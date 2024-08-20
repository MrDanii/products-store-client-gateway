
// (req: any, file: {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   size: number;
//   destination: string;
//   filename: string;
//   path: string;
//   buffer: Buffer;
// }, callback: (error: Error, acceptFile: boolean) => void): void

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if (!file) return callback(new Error('File is empty'), false)

  const fileExtension = file.mimetype.split('/')[1]
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

  if (validExtensions.includes(fileExtension)) {
    // before proced with request, we apply fileNamer 
    callback(null, true)
  }

  callback(null, false)
}
