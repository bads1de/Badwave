import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

import { useUser } from "@/hooks/auth/useUser";

import Modal from "./Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";

import useSpotLightUploadModal from "@/hooks/modal/useSpotLightUpload";
import useSpotlightUploadMutation from "@/hooks/data/useSpotlightUploadMutation";
import { Textarea } from "../ui/textarea";

const SpotlightUploadModal = () => {
  const spotlightUploadModal = useSpotLightUploadModal();
  const { user } = useUser();

  // TanStack Queryを使用したミューテーション
  const { mutateAsync, isPending: isLoading } =
    useSpotlightUploadMutation(spotlightUploadModal);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      video: null,
      title: "",
      author: "",
      genre: "",
      description: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      spotlightUploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      // TanStack Queryのミューテーションを使用
      await mutateAsync({
        title: values.title,
        author: values.author,
        genre: values.genre,
        description: values.description,
        videoFile: values.video?.[0] || null,
      });

      // 成功時の処理はミューテーションのonSuccessで行われる
    } catch (error) {
      // エラー処理はミューテーション内で行われる
      console.error("Spotlight upload error:", error);
    }
  };

  return (
    <Modal
      title="Spotlightに動画を投稿"
      description="動画をアップロードしてSpotlightで共有しましょう！"
      isOpen={spotlightUploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="動画のタイトル"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="投稿者名"
        />
        {/* ジャンル選択用のSelect */}
        <Input
          id="genre"
          disabled={isLoading}
          {...register("genre")}
          placeholder="ジャンルを記載"
        />
        {/* 説明入力用のTextarea */}
        <Textarea
          id="description"
          disabled={isLoading}
          {...register("description")}
          placeholder="動画の説明"
          className="resize-none" // リサイズ不可にする
        />
        <div>
          <div className="pb-1">動画ファイル</div>
          <Input
            type="file"
            accept="video/*"
            id="video"
            disabled={isLoading}
            {...register("video", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          投稿する
        </Button>
      </form>
    </Modal>
  );
};

export default SpotlightUploadModal;
