from django.contrib import admin

from .models import Review, PlatformReview, recalc_professional_rating


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'professional', 'client', 'rating', 'flagged', 'created_at')
    list_filter = ('flagged', 'rating', 'created_at')
    search_fields = ('order__order_number', 'professional__business_name', 'client__email', 'text')
    raw_id_fields = ('order', 'client', 'professional')
    readonly_fields = ('created_at', 'updated_at')
    actions = ('mark_flagged', 'unmark_flagged')

    @admin.action(description='Marcar como indebida (flagged)')
    def mark_flagged(self, request, queryset):
        for review in queryset:
            review.flagged = True
            review.save(update_fields=['flagged'])
            recalc_professional_rating(review.professional)

    @admin.action(description='Quitar marca (unflag)')
    def unmark_flagged(self, request, queryset):
        for review in queryset:
            review.flagged = False
            review.save(update_fields=['flagged'])
            recalc_professional_rating(review.professional)


@admin.register(PlatformReview)
class PlatformReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'rating', 'flagged', 'created_at')
    list_filter = ('flagged', 'rating')
    search_fields = ('user__email', 'text')
