from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FolderViewSet, TestViewSet,
    SessionViewSet, AnswerRecordViewSet,
    UserViewSet,
    MyTokenObtainPairView, TokenRefreshView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'tests', TestViewSet, basename='test')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'answers', AnswerRecordViewSet, basename='answer')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]