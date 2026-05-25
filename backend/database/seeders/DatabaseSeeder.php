<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Certification;
use App\Models\CmsAbout;
use App\Models\Course;
use App\Models\Patient;
use App\Models\Post;
use App\Models\SocialLink;
use App\Models\User;
use App\Models\Video;
use App\Models\WorkingHour;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Dr. Halla',
            'email' => 'drhalla@clinic.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
        ]);

        $patientUser = User::create([
            'name' => 'John Patient',
            'email' => 'patient@example.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Patient,
        ]);

        Patient::create([
            'user_id' => $patientUser->id,
            'phone' => '+1234567890',
            'date_of_birth' => '1990-01-15',
            'gender' => 'male',
            'address' => '123 Main St, City',
        ]);

        $workingDays = [
            ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '17:00'], // Monday
            ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '17:00'], // Tuesday
            ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '17:00'], // Wednesday
            ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '17:00'], // Thursday
            ['day_of_week' => 5, 'start_time' => '09:00', 'end_time' => '17:00'], // Friday
        ];

        foreach ($workingDays as $day) {
            WorkingHour::create($day);
        }

        CmsAbout::create([
            'title' => 'About Dr. Halla',
            'content' => 'Dr. Halla is a licensed clinical psychologist with over 15 years of experience in providing compassionate mental health care. Specializing in anxiety, depression, and family counseling, Dr. Halla is dedicated to helping patients achieve emotional well-being through evidence-based therapeutic approaches.',
            'image_url' => '/images/dr-halla.jpg',
            'is_active' => true,
        ]);

        Course::create([
            'title' => 'Stress Management Fundamentals',
            'description' => 'Learn practical techniques to manage daily stress and build resilience. This course covers mindfulness, breathing exercises, and cognitive reframing.',
            'price' => 49.99,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Course::create([
            'title' => 'Mindfulness Meditation',
            'description' => 'A guided journey into mindfulness practices. Includes weekly sessions, meditation recordings, and personalized feedback.',
            'price' => 79.99,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Course::create([
            'title' => 'Anxiety Relief Program',
            'description' => 'A comprehensive 8-week program designed to help you understand and manage anxiety through CBT techniques and support.',
            'price' => 149.99,
            'sort_order' => 3,
            'is_active' => true,
        ]);

        Video::create([
            'title' => 'Introduction to Mindfulness',
            'url' => 'https://www.youtube.com/watch?v=example1',
            'description' => 'A brief introduction to mindfulness and its benefits for mental health.',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Video::create([
            'title' => 'Breathing Exercises for Anxiety',
            'url' => 'https://www.youtube.com/watch?v=example2',
            'description' => 'Simple breathing techniques to calm your mind in moments of stress.',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'Licensed Clinical Psychologist',
            'image_url' => '/images/cert-psychologist.png',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'Cognitive Behavioral Therapy (CBT) Certified',
            'image_url' => '/images/cert-cbt.png',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'Mindfulness-Based Stress Reduction (MBSR)',
            'image_url' => '/images/cert-mbsr.png',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        Certification::create([
            'title' => 'EMDR Therapy Practitioner',
            'image_url' => '/images/cert-emdr.png',
            'sort_order' => 4,
            'is_active' => true,
        ]);

        SocialLink::create([
            'platform' => 'whatsapp',
            'label' => 'تواصل معنا',
            'url' => 'https://wa.me/201234567890',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        SocialLink::create([
            'platform' => 'facebook',
            'label' => 'لمعرفه الجلسات المتاحه',
            'url' => 'https://www.facebook.com/hala.el.ghobary.2025/',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        SocialLink::create([
            'platform' => 'facebook',
            'label' => 'احجز موعد',
            'url' => '/book',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        Post::create([
            'title' => 'جلسة استشارية فردية',
            'content' => 'جلسة علاج نفسي فردي مع د. هالة لمساعدتك في التغلب على القلق والتوتر.',
            'price' => 200.00,
            'max_members' => 1,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Post::create([
            'title' => 'ورشة عمل إدارة الضغوط',
            'content' => 'ورشة عمل جماعية لتعلم تقنيات إدارة الضغوط اليومية وتحسين جودة الحياة.',
            'price' => 150.00,
            'max_members' => 15,
            'start_date' => '2026-06-15',
            'end_date' => '2026-07-15',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Post::create([
            'title' => 'برنامج العلاج الجماعي',
            'content' => 'برنامج علاج جماعي مكثف لدعم الصحة النفسية من خلال التفاعل الجماعي.',
            'price' => 100.00,
            'max_members' => 10,
            'start_date' => '2026-07-01',
            'end_date' => '2026-08-01',
            'sort_order' => 3,
            'is_active' => true,
        ]);
    }
}
