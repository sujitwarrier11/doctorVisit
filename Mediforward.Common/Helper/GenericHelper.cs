using Mediforward.Common.Helper;
using Mediforward.Common.Identity;
using Mediforward.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;

namespace Mediforward.Common
{
    public static class GenericHelper
    {
        public static TTarget MapTo<TTarget>(this object source, TTarget target = null, List<KeyValuePair<string, string>> mappings = null, params Expression<Func<TTarget, object>>[] ignoreProperties) where TTarget : class, new()
        {
            if (source == null) { return null; }
            if (target == null) { target = new TTarget(); }
            var sourceProperties = source.GetType().GetProperties();
            var destinationProperties = typeof(TTarget).GetProperties().Where(dest => dest.CanWrite);
            foreach (var destinationProperty in destinationProperties)
            {
                var sourceProperty = sourceProperties.FirstOrDefault(src => src.Name == destinationProperty.Name);
                if (sourceProperty != null)
                {
                    if (sourceProperty.PropertyType == destinationProperty.PropertyType)
                    {
                        bool canIgnore = false;
                        if (ignoreProperties != null)
                        {
                            foreach (var ignoreProperty in ignoreProperties)
                            {
                                var body = ignoreProperty.Body as MemberExpression;
                                if (body == null)
                                {
                                    body = ((UnaryExpression)ignoreProperty.Body).Operand as MemberExpression;
                                }
                                if (destinationProperty.Name == body.Member.Name)
                                {
                                    canIgnore = true;
                                    break;
                                }
                            }
                        }
                        if (!canIgnore)
                        {
                            destinationProperty.SetValue(target, sourceProperty.GetValue(source));
                        }

                    }

                }
                else
                {
                    if (mappings != null)
                    {
                        foreach (KeyValuePair<string, string> kv in mappings)
                        {
                            if (destinationProperty.Name == kv.Value)
                            {
                                var property = sourceProperties.Where(prop => prop.Name == kv.Key).FirstOrDefault();
                                if (property != null && property.PropertyType == destinationProperty.PropertyType)
                                {
                                    destinationProperty.SetValue(target, property.GetValue(source));
                                }
                            }

                        }
                    }
                }
            }
            return target;
        }


        public static string GenerateRandomPassword(int length)
        {
            string src = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            string password = "";
            Random r = new Random();
            for (int i = 0; i < length; i++)
            {
                password += src[r.Next(0, src.Length)];
            }
            return password;
        }

        public static PaymentModel GenerateReceiptId(PaymentModel model)
        {
            DateTime dt = DateTime.Now;
            string ReceiptId = $"{dt.Day.ToString("D2")}{dt.Month.ToString("D2")}{dt.Year}{new Random().Next(0, 1000).ToString("D3")}{model.Id}";
            model.ReceiptId = ReceiptId;
            return model;
        }

        public static string GenerateForgotPasswordToken(User model)
        {
            string source = string.Concat(model.FirstName,model.LastName,model.Email);
            using (SHA256 sha256Hash = SHA256.Create())
            {
               return GetHash(sha256Hash, source);

            }
        }
        private static string GetHash(HashAlgorithm hashAlgorithm, string input)
        {

            // Convert the input string to a byte array and compute the hash.
            byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            var sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public static bool VerifyHash(User model, string hash)
        {
            string source = string.Concat(model.FirstName, model.LastName, model.Email);
            using (SHA256 sha256Hash = SHA256.Create())
            {
                string generatedHash = GetHash(sha256Hash, source);
                return generatedHash == hash;
            }
        }
    }
}
