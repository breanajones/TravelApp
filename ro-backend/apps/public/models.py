from django.db import models
from django.contrib.auth.models import User, AbstractUser
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from settings.base import AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    ''' Creates a token whenever a User is created '''
    if created:
        Token.objects.create(user=instance)

class ExtendedUser(AbstractUser):
   testField = models.CharField(max_length=200)

class Address(models.Model):
    ''' Model features for an address '''
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    gps = models.CharField(max_length=300)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.city, self.state, self.gps)

    class Meta:
        verbose_name_plural = 'Address'

class Location(models.Model):
    ''' Model features for an address '''
    locationName = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    photos = models.ImageField(upload_to='img/locations', blank=True, null=True)
    description = models.CharField(max_length=1000)
    comments = models.CharField(max_length=500)
    sponsored = models.CharField(max_length=200)
    upVoteCount = models.CharField(max_length=200)
    downVoteCount = models.CharField(max_length=200)
    user = models.CharField(max_length=200)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.locationName, self.user, self.description)

    class Meta:
        verbose_name_plural = 'Location'

class Comment(models.Model):
    ''' Model features for an address '''
    user = models.ForeignKey(AUTH_USER_MODEL)
    locationPostID = models.ForeignKey(Location)
    commentText = models.CharField(max_length=200)

    def __unicode__(self):
        return u'%s, %s, %s' % (self.user, self.LocationPostId, self.commentText)

    class Meta:
        verbose_name_plural = 'Comment'
