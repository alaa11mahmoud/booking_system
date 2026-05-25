<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\CmsAbout;
use App\Models\Course;
use App\Models\Faq;
use App\Models\Post;
use App\Models\SocialLink;
use App\Models\Testimonial;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminCmsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function updateAbout(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|string|max:255',
        ]);

        CmsAbout::where('is_active', true)->update(['is_active' => false]);

        $about = CmsAbout::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($about);
    }

    public function storeCourse(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    public function updateCourse(Request $request, Course $course): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'content' => 'string',
            'session_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'session_time' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'max_members' => 'required|integer|min:1',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $course->update($validated);

        return response()->json($course);
    }

    public function storeVideo(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'file_url' => 'nullable|string|max:255',
            'cover_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
        ]);

        $video = Video::create($validated);

        return response()->json($video, 201);
    }

    public function updateVideo(Request $request, Video $video): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'url' => 'nullable|string|max:255',
            'file_url' => 'nullable|string|max:255',
            'cover_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $video->update($validated);

        return response()->json($video);
    }

    public function deleteCourse(Course $course): JsonResponse
    {
        $course->delete();
        return response()->json(['message' => __('messages.course_deleted')]);
    }

    public function deleteVideo(Video $video): JsonResponse
    {
        $video->delete();
        return response()->json(['message' => __('messages.video_deleted')]);
    }

    public function storeCertification(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $certification = Certification::create($validated);

        return response()->json($certification, 201);
    }

    public function updateCertification(Request $request, Certification $certification): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $certification->update($validated);

        return response()->json($certification);
    }

    public function deleteCertification(Certification $certification): JsonResponse
    {
        $certification->delete();
        return response()->json(['message' => __('messages.certification_deleted')]);
    }

    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('sort_order')->get();
        return response()->json($testimonials);
    }

    public function storeTestimonial(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'review' => 'required|string',
            'avatar_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
        ]);

        $testimonial = Testimonial::create($validated);

        return response()->json($testimonial, 201);
    }

    public function updateTestimonial(Request $request, Testimonial $testimonial): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'role' => 'nullable|string|max:255',
            'review' => 'string',
            'avatar_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $testimonial->update($validated);

        return response()->json($testimonial);
    }

    public function deleteTestimonial(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(['message' => 'تم حذف الشهادة']);
    }

    public function faqs(): JsonResponse
    {
        $faqs = Faq::orderBy('sort_order')->get();
        return response()->json($faqs);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        $faq = Faq::create($validated);

        return response()->json($faq, 201);
    }

    public function updateFaq(Request $request, Faq $faq): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'question' => 'string|max:500',
            'answer' => 'string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return response()->json($faq);
    }

    public function deleteFaq(Faq $faq): JsonResponse
    {
        $faq->delete();
        return response()->json(['message' => 'تم حذف السؤال']);
    }

    public function socialLinks(): JsonResponse
    {
        $links = SocialLink::orderBy('sort_order')->get();
        return response()->json($links);
    }

    public function storeSocialLink(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'platform' => 'required|string|max:50',
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:500',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
        ]);

        $link = SocialLink::create($validated);

        return response()->json($link, 201);
    }

    public function updateSocialLink(Request $request, SocialLink $socialLink): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'platform' => 'string|max:50',
            'label' => 'string|max:255',
            'url' => 'string|max:500',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $socialLink->update($validated);

        return response()->json($socialLink);
    }

    public function deleteSocialLink(SocialLink $socialLink): JsonResponse
    {
        $socialLink->delete();
        return response()->json(['message' => 'تم حذف الرابط']);
    }

    public function storePost(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'nullable|numeric|min:0',
            'max_members' => 'required|integer|min:1',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function updatePost(Request $request, Post $post): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'start_date' => 'nullable|date|after_or_equal:today',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'price' => 'nullable|numeric|min:0',
            'max_members' => 'integer|min:1',
            'image_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function deletePost(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json(['message' => __('messages.post_deleted')]);
    }

    public function uploadVideo(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'file' => 'required|mimes:mp4,mov,avi,webm,mkv|max:204800',
        ]);

        if ($validator->fails()) {
            Log::warning('Video upload validation failed', [
                'errors' => $validator->errors()->toArray(),
                'file_name' => $request->file('file')?->getClientOriginalName(),
                'file_size' => $request->file('file')?->getSize(),
                'file_mime' => $request->file('file')?->getMimeType(),
            ]);

            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $path = $request->file('file')->store('uploads', 'public');
            $url = Storage::url($path);

            return response()->json(['url' => $url]);
        } catch (\Throwable $e) {
            Log::error('Video upload failed: ' . $e->getMessage(), [
                'file' => $request->file('file')?->getClientOriginalName(),
                'size' => $request->file('file')?->getSize(),
            ]);

            return response()->json([
                'message' => __('messages.upload_failed'),
            ], 500);
        }
    }

    public function uploadImage(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => __('messages.forbidden')], 403);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
        ]);

        if ($validator->fails()) {
            Log::warning('Image upload validation failed', [
                'errors' => $validator->errors()->toArray(),
                'file_name' => $request->file('file')?->getClientOriginalName(),
                'file_size' => $request->file('file')?->getSize(),
                'file_mime' => $request->file('file')?->getMimeType(),
            ]);

            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $path = $request->file('file')->store('uploads', 'public');
            $url = url(Storage::url($path));

            return response()->json(['url' => $url]);
        } catch (\Throwable $e) {
            Log::error('Image upload failed: ' . $e->getMessage(), [
                'file' => $request->file('file')?->getClientOriginalName(),
                'size' => $request->file('file')?->getSize(),
            ]);

            return response()->json([
                'message' => __('messages.upload_failed'),
            ], 500);
        }
    }
}
