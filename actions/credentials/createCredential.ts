"use server";

import { sysmmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form:createCredentialSchemaType) {
    const {success, data} = createCredentialSchema.safeParse(form);
    if(!success){
        throw new Error("invalid form data");
    }

    const {userId} =auth();
    if(!userId){
        throw new Error("Unauthenticated");
    }

    //Encrypt the value

    const encryptedValue = sysmmetricEncrypt(data.value);
    console.log("@TEST",{
        plain:data.value,
        encrypted:encryptedValue
    })

    const result = await prisma.credential.create({
        data:{
            userId,
            name:data.name,
            value:encryptedValue,
        }
    })

    if(!result){
        throw new Error("failed to create credential");
    }

    revalidatePath(`/credentials`)
}

export async function deleteCredential(id: string) {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthenticated");
    }
  
    await prisma.credential.delete({
      where: {
        userId,
        id,
      },
    });
  
    revalidatePath("/credentials");
  }
  