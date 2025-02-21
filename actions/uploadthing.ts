"use server"

import { utapi } from "./utapi";
import { FileEsque, UploadFileResult } from "uploadthing/types";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as FileEsque;

    const response: UploadFileResult = await utapi.uploadFiles(file);

    if (response.data) {
      return { success: true, fileUrl: response.data.url };
    }

    return { success: false, fileUrl: null };
  } catch (error) {
    console.log("Error al subir la imagen");
  }
}
