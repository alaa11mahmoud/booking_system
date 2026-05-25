<?php

use App\Http\Controllers\Api\AdminCmsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CmsController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PostSubscriptionController;
use App\Http\Controllers\Api\SlotController;
use App\Http\Controllers\Api\WorkingHourController;
use App\Models\SocialLink;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/slots', [SlotController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{appointment}', [BookingController::class, 'show']);
    Route::patch('/bookings/{appointment}/status', [BookingController::class, 'updateStatus']);
    Route::post('/bookings/complete-past', [BookingController::class, 'completePast']);
    Route::get('/subscriptions', [PostSubscriptionController::class, 'index']);
    Route::post('/posts/{post}/subscribe', [PostSubscriptionController::class, 'store']);
    Route::delete('/subscriptions/{postSubscription}', [PostSubscriptionController::class, 'destroy']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    Route::get('/working-hours', [WorkingHourController::class, 'index']);
    Route::put('/working-hours', [WorkingHourController::class, 'update']);

    Route::put('/cms/about', [AdminCmsController::class, 'updateAbout']);
    Route::post('/cms/courses', [AdminCmsController::class, 'storeCourse']);
    Route::put('/cms/courses/{course}', [AdminCmsController::class, 'updateCourse']);
    Route::delete('/cms/courses/{course}', [AdminCmsController::class, 'deleteCourse']);
    Route::post('/cms/videos', [AdminCmsController::class, 'storeVideo']);
    Route::put('/cms/videos/{video}', [AdminCmsController::class, 'updateVideo']);
    Route::delete('/cms/videos/{video}', [AdminCmsController::class, 'deleteVideo']);
    Route::post('/cms/certifications', [AdminCmsController::class, 'storeCertification']);
    Route::put('/cms/certifications/{certification}', [AdminCmsController::class, 'updateCertification']);
    Route::delete('/cms/certifications/{certification}', [AdminCmsController::class, 'deleteCertification']);
    Route::post('/cms/posts', [AdminCmsController::class, 'storePost']);
    Route::put('/cms/posts/{post}', [AdminCmsController::class, 'updatePost']);
    Route::delete('/cms/posts/{post}', [AdminCmsController::class, 'deletePost']);
    Route::post('/upload', [AdminCmsController::class, 'uploadImage']);
    Route::post('/upload-video', [AdminCmsController::class, 'uploadVideo']);
    Route::get('/cms/social-links', [AdminCmsController::class, 'socialLinks']);
    Route::post('/cms/social-links', [AdminCmsController::class, 'storeSocialLink']);
    Route::put('/cms/social-links/{socialLink}', [AdminCmsController::class, 'updateSocialLink']);
    Route::delete('/cms/social-links/{socialLink}', [AdminCmsController::class, 'deleteSocialLink']);
    Route::get('/cms/testimonials', [AdminCmsController::class, 'testimonials']);
    Route::post('/cms/testimonials', [AdminCmsController::class, 'storeTestimonial']);
    Route::put('/cms/testimonials/{testimonial}', [AdminCmsController::class, 'updateTestimonial']);
    Route::delete('/cms/testimonials/{testimonial}', [AdminCmsController::class, 'deleteTestimonial']);
    Route::get('/cms/faqs', [AdminCmsController::class, 'faqs']);
    Route::post('/cms/faqs', [AdminCmsController::class, 'storeFaq']);
    Route::put('/cms/faqs/{faq}', [AdminCmsController::class, 'updateFaq']);
    Route::delete('/cms/faqs/{faq}', [AdminCmsController::class, 'deleteFaq']);
});

Route::get('/cms/about', [CmsController::class, 'about']);
Route::get('/cms/courses', [CmsController::class, 'courses']);
Route::get('/cms/videos', [CmsController::class, 'videos']);
Route::get('/cms/certifications', [CmsController::class, 'certifications']);
Route::get('/cms/posts', [CmsController::class, 'posts']);
Route::get('/cms/posts/{post}', [CmsController::class, 'post']);
Route::get('/cms/social-links', [CmsController::class, 'socialLinks']);
Route::get('/cms/testimonials', [CmsController::class, 'testimonials']);
Route::get('/cms/faqs', [CmsController::class, 'faqs']);
