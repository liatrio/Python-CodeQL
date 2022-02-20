from django.db import IntegrityError
from django.test import TransactionTestCase
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

class UserManagerTests(TransactionTestCase):
    
    def test_create_user(self):
        unique_email = (get_random_string(length=50) + '@' + get_random_string(length=10) + '.' + get_random_string(length=3)).casefold()
        user = get_user_model().objects.create_user(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user.email, 'test@test.test')
        self.assertEqual(user.first_name, 'Foo')
        self.assertEqual(user.last_name, 'Bar')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_admin)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            get_user_model().objects.create_user()
        with self.assertRaises(TypeError):
            get_user_model().objects.create_user(email='')
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(email='', first_name='Foo', last_name='Bar', password='Bar Foo')
        try:
            user = get_user_model().objects.create_user(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass
        user2 = get_user_model().objects.create_user(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user2.email, unique_email)
        try:
            user = get_user_model().objects.create_user(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass

    def test_create_staffuser(self):
        unique_email = (get_random_string(length=50) + '@' + get_random_string(length=10) + '.' + get_random_string(length=3)).casefold()
        user = get_user_model().objects.create_staffuser(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user.email, 'test@test.test')
        self.assertEqual(user.first_name, 'Foo')
        self.assertEqual(user.last_name, 'Bar')
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertFalse(user.is_admin)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            get_user_model().objects.create_staffuser()
        with self.assertRaises(TypeError):
            get_user_model().objects.create_staffuser(email='')
        with self.assertRaises(ValueError):
            get_user_model().objects.create_staffuser(email='', first_name='Foo', last_name='Bar', password='Bar Foo')
        try:
            user = get_user_model().objects.create_staffuser(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass
        user2 = get_user_model().objects.create_staffuser(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user2.email, unique_email)
        try:
            user = get_user_model().objects.create_staffuser(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass

    def test_create_superuser(self):
        unique_email = (get_random_string(length=50) + '@' + get_random_string(length=10) + '.' + get_random_string(length=3)).casefold()
        user = get_user_model().objects.create_superuser(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user.email, 'test@test.test')
        self.assertEqual(user.first_name, 'Foo')
        self.assertEqual(user.last_name, 'Bar')
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_admin)
        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            get_user_model().objects.create_superuser()
        with self.assertRaises(TypeError):
            get_user_model().objects.create_superuser(email='')
        with self.assertRaises(ValueError):
            get_user_model().objects.create_superuser(email='', first_name='Foo', last_name='Bar', password='Bar Foo')
        try:
            user = get_user_model().objects.create_superuser(email='test@test.test', first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass
        user2 = get_user_model().objects.create_superuser(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        self.assertEqual(user2.email, unique_email)
        try:
            user = get_user_model().objects.create_superuser(email=unique_email, first_name='Foo', last_name='Bar', password='Bar Foo')
        except IntegrityError:
            pass
