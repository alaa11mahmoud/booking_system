<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\CmsAbout;
use App\Models\Course;
use App\Models\Faq;
use App\Models\Post;
use App\Models\PostSubscription;
use App\Models\SocialLink;
use App\Models\Testimonial;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CmsController extends Controller
{
    public function about(): JsonResponse
    {
        $about = Cache::remember('cms_about', 3600, function () {
            $about = CmsAbout::where('is_active', true)->latest()->first();

            if ($about && $about->image_url && !str_starts_with($about->image_url, 'http')) {
                $about->image_url = url($about->image_url);
            }

            return $about;
        });

        return response()->json($about);
    }

    public function courses(): JsonResponse
    {
        $courses = Cache::remember('cms_courses', 3600, function () {
            return Course::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($courses);
    }

    public function videos(): JsonResponse
    {
        $videos = Cache::remember('cms_videos', 3600, function () {
            return Video::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($videos);
    }

    public function certifications(): JsonResponse
    {
        $certifications = Cache::remember('cms_certifications', 3600, function () {
            return Certification::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($certifications);
    }

    public function socialLinks(): JsonResponse
    {
        $links = Cache::remember('cms_social_links', 3600, function () {
            return SocialLink::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($links);
    }

    public function testimonials(): JsonResponse
    {
        $testimonials = Cache::remember('cms_testimonials', 3600, function () {
            return Testimonial::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($testimonials);
    }

    public function faqs(): JsonResponse
    {
        $faqs = Cache::remember('cms_faqs', 3600, function () {
            return Faq::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return response()->json($faqs);
    }

    public function posts(Request $request): JsonResponse
    {
        $posts = Post::withCount('subscriptions')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->each(function ($post) {
                $post->available_spots = $post->max_members
                    ? $post->max_members - $post->subscriptions_count
                    : null;
            });

        if ($request->user()) {
            $patient = $request->user()->patient;
            if ($patient) {
                $subscriptions = PostSubscription::where('patient_id', $patient->id)
                    ->get()
                    ->keyBy('post_id');

                $posts->each(function ($post) use ($subscriptions) {
                    if ($subscriptions->has($post->id)) {
                        $post->is_subscribed = true;
                        $post->subscription_id = $subscriptions->get($post->id)->id;
                    }
                });
            }
        }

        return response()->json($posts);
    }

    public function post(Request $request, Post $post): JsonResponse
    {
        if (!$post->is_active) {
            return response()->json(['message' => __('messages.not_found')], 404);
        }

        $post->loadCount('subscriptions');
        $post->available_spots = $post->max_members
            ? $post->max_members - $post->subscriptions_count
            : null;

        if ($request->user()) {
            $patient = $request->user()->patient;
            if ($patient) {
                $sub = PostSubscription::where('post_id', $post->id)
                    ->where('patient_id', $patient->id)
                    ->first();

                if ($sub) {
                    $post->is_subscribed = true;
                    $post->subscription_id = $sub->id;
                }
            }
        }

        return response()->json($post);
    }
}
