package co.hotwax.ionic.sdk;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
import com.google.firebase.dynamiclinks.PendingDynamicLinkData;

import java.util.ArrayList;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

      FirebaseDynamicLinks.getInstance().getDynamicLink(getIntent())
              .addOnSuccessListener(this, new OnSuccessListener<PendingDynamicLinkData>() {
                  @Override
                  public void onSuccess(PendingDynamicLinkData pendingDynamicLinkData) {
                      // Get deep link from result (may be null if no link is found)
                      Uri deepLink = null;
                      if (pendingDynamicLinkData != null) {
                          deepLink = pendingDynamicLinkData.getLink();
                      }


                      // Handle the deep link. For example, open the linked content,
                      // or apply promotional credit to the user's account.
                      // ...

                      // ...
                  }
              })
              .addOnFailureListener(this, new OnFailureListener() {
                  @Override
                  public void onFailure(@NonNull Exception e) {
                      System.out.println(e);
                  }
              });



      // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});
  }
}

