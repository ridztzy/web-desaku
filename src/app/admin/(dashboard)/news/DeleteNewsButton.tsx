"use client";

import React, { useState, useTransition } from "react";
import { deleteNewsAction } from "./actions";

export default function DeleteNewsButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(false);
    startTransition(async () => {
      await deleteNewsAction(id);
    });
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="p-2 text-stone-400 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
        title="Hapus Artikel"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isPending ? "hourglass_top" : "delete"}
        </span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 whitespace-normal">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col items-center text-center mx-4">
            <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-5 ring-8 ring-error/5">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-3">Hapus Artikel Ini?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              Tindakan ini bersifat permanen dan tidak bisa dibatalkan.<br/>Baris data artikel ini juga akan terhapus selamanya dari Google Sheets Anda.
            </p>
            <div className="flex w-full items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-stone-600 hover:bg-surface-container transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-error text-white hover:bg-error/90 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
