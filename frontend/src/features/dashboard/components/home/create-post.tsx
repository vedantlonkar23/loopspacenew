"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog"
import Image from "next/image"
import { X, Upload } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/src/components/ui/alert"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  eventCode: z.string().optional(),
  media: z
    .any()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Media file must be less than 2MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported",
    ),
})

type PostFormValues = z.infer<typeof postFormSchema>

export default function CreatePostDialog() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventCode: "",
    },
  })

  const handlePost = async (values: PostFormValues) => {
    if (fileError) {
      toast.error("Please fix the media file error before posting")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      if (values.eventCode) formData.append("eventCode", values.eventCode)
      if (file) formData.append("media", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/create-post`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || "Failed to create post")
      }

      const result = await response.json()
      toast.success("Post created successfully!")
      form.reset()
      setImage(null)
      setFile(null)
      setFileError(null)
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setFileError(null)

    if (!selectedFile) return

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("Media file must be less than 2MB")
      event.target.value = ""
      return
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setFileError("Only .jpg, .jpeg, .png, .webp, and .gif formats are supported")
      event.target.value = ""
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => setImage(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }

  const resetForm = () => {
    form.reset()
    setImage(null)
    setFile(null)
    setFileError(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground">
          What&apos;s on your mind?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePost)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's on your mind?" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Code (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="6-digit event code"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value.slice(0, 6))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Media (optional)</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="media-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {file && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setImage(null)
                      setFile(null)
                      setFileError(null)
                      const input = document.getElementById("media-upload") as HTMLInputElement
                      if (input) input.value = ""
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {fileError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum file size: 2MB. Supported formats: JPG, PNG, WebP, GIF
              </p>
            </div>

            {image && (
              <div className="relative flex justify-center items-center mt-4 border rounded-md p-2">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Post image"
                  width={300}
                  height={200}
                  className="rounded-md h-auto max-h-[300px] object-contain"
                />
              </div>
            )}

            <DialogFooter className="mt-6 flex gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" disabled={loading || !!fileError} className="flex items-center gap-2">
                {loading ? "Posting..." : "Post"}
                {!loading && <Upload className="h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

