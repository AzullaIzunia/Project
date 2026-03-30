-- CreateTable
CREATE TABLE "DrawSession" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "witch_id" INTEGER NOT NULL,
    "choices" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrawSession_pkey" PRIMARY KEY ("session_id")
);

-- AddForeignKey
ALTER TABLE "DrawSession" ADD CONSTRAINT "DrawSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
