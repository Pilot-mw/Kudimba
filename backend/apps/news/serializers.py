from rest_framework import serializers
from .models import ArticleCategory, Article


class ArticleCategorySerializer(serializers.ModelSerializer):
    articles_count = serializers.SerializerMethodField()

    class Meta:
        model = ArticleCategory
        fields = ['id', 'name', 'slug', 'articles_count']
        read_only_fields = ['id', 'slug', 'articles_count']

    def get_articles_count(self, obj):
        return obj.articles.filter(status='published').count()


class ArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_names = serializers.StringRelatedField(
        source='categories', many=True, read_only=True
    )

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'excerpt', 'featured_image',
                  'author_name', 'author_username', 'category_names',
                  'status', 'is_featured', 'published_at', 'created_at',
                  'content']
        read_only_fields = fields


class CategoryIdsField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str):
            data = [data]
        if not isinstance(data, list):
            self.fail('not_a_list')
        qs = ArticleCategory.objects.all()
        result = []
        for item in data:
            try:
                result.append(qs.get(pk=int(item)))
            except (ValueError, ArticleCategory.DoesNotExist):
                raise serializers.ValidationError(f'Invalid category: {item}')
        return result

    def to_representation(self, value):
        return [obj.pk for obj in value.all()]


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_ids = CategoryIdsField(required=False)

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'featured_image',
                  'categories', 'category_ids', 'author', 'author_name', 'author_username',
                  'status', 'is_featured', 'published_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'author_name', 'author_username',
                            'created_at', 'updated_at']

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        instance = super().create(validated_data)
        if category_ids:
            instance.categories.set(category_ids)
        return instance

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        instance = super().update(instance, validated_data)
        if category_ids is not None:
            instance.categories.set(category_ids)
        return instance
