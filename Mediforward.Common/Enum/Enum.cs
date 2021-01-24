using System;
using System.Collections.Generic;
using System.Text;

namespace Mediforward.Common
{

    public enum AddressType
    {
        Organization,
        Mailing,
        Other,
    }

    public enum AppointmentStatus
    {
        Active,
        Cancelled,
        Completed
    }

    public enum PaymentStatus
    {
        PaymentPending,
        PaymentCompleted
    }

    public enum TransactionStatus
    {
        Initiated,
        Cancelled,
        Received
    }

    public enum AppointmentType
    {
        VideoCall,
        AudioCall,
        InPerson
    }

    public enum ElementTypes
    {
        Image,
        Audio,
        Video,
        Text,
        Youtube,
        Link,
        Doc
    }
    public enum InstitutionType
    {
        Individual,
        Business
    }

    public enum ThemeContentType
    {
        Logo= 0,
        BannerLarge =1,
        BannerTab = 2,
        BannerMobile =3,
        MainBackgroundColor=4,
        ThemeSubColor1=5,
        ThemeSubColor2=6,
        FontFamily=7,
        NavlinkFontColor=8,
        MainTitleFontColor=9,
        MainTitleFontSize=10,
        RegularTextColor=11,
        MainSubtitleFontSize=12,
        RegularFontSize =13,
        NavLinkFontSize=14
    }

  
}
