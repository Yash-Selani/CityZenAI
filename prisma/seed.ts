import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const authorities = [
  // --- Madhya Pradesh ---
  { name: 'Ujjain Nagar Nigam', email: 'commissioner@ujjainnagarnigam.org', phone: '0734-2515544', city: 'Ujjain', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Indore Municipal Corporation', email: 'commissioner@imcindore.org', phone: '0731-2432222', city: 'Indore', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Bhopal Municipal Corporation', email: 'commissioner@bmcbhopal.org', phone: '0755-2550600', city: 'Bhopal', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Gwalior Municipal Corporation', email: 'commissioner@gmcgwalior.org', phone: '0751-2321100', city: 'Gwalior', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Jabalpur Municipal Corporation', email: 'commissioner@jmcjabalpur.org', phone: '0761-2620200', city: 'Jabalpur', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Sagar Municipal Corporation', email: 'commissioner@sagarnagarnigam.org', phone: '07582-223344', city: 'Sagar', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Dewas Nagar Palika', email: 'cmo@dewasnp.org', phone: '07272-252525', city: 'Dewas', state: 'Madhya Pradesh', department: 'Nagar Palika' },
  { name: 'Ratlam Nagar Nigam', email: 'commissioner@ratlamnagarnigam.org', phone: '07412-233344', city: 'Ratlam', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Satna Municipal Corporation', email: 'commissioner@satnamc.org', phone: '07672-222333', city: 'Satna', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  { name: 'Rewa Nagar Nigam', email: 'commissioner@rewann.org', phone: '07662-244455', city: 'Rewa', state: 'Madhya Pradesh', department: 'Municipal Corporation' },
  // --- Maharashtra ---
  { name: 'BMC Mumbai', email: 'commissioner@mcgm.gov.in', phone: '022-22620251', city: 'Mumbai', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Pune Municipal Corporation', email: 'commissioner@pmc.gov.in', phone: '020-25501000', city: 'Pune', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Nagpur Municipal Corporation', email: 'commissioner@nmcnagpur.gov.in', phone: '0712-2567001', city: 'Nagpur', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Nashik Municipal Corporation', email: 'commissioner@nashikcorporation.in', phone: '0253-2574757', city: 'Nashik', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Aurangabad Municipal Corporation', email: 'commissioner@amcaurangabad.org', phone: '0240-2334188', city: 'Aurangabad', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Thane Municipal Corporation', email: 'commissioner@thanecity.gov.in', phone: '022-25331661', city: 'Thane', state: 'Maharashtra', department: 'Municipal Corporation' },
  { name: 'Navi Mumbai Municipal Corporation', email: 'commissioner@nmmc.gov.in', phone: '022-27567001', city: 'Navi Mumbai', state: 'Maharashtra', department: 'Municipal Corporation' },
  // --- Delhi ---
  { name: 'Municipal Corporation of Delhi', email: 'commissioner@mcd.delhi.gov.in', phone: '011-23227400', city: 'Delhi', state: 'Delhi', department: 'Municipal Corporation' },
  { name: 'New Delhi Municipal Council', email: 'secretary@ndmc.gov.in', phone: '011-23364679', city: 'New Delhi', state: 'Delhi', department: 'Municipal Council' },
  // --- Karnataka ---
  { name: 'BBMP Bengaluru', email: 'commissioner@bbmp.gov.in', phone: '080-22975500', city: 'Bengaluru', state: 'Karnataka', department: 'Municipal Corporation' },
  { name: 'Mysuru City Corporation', email: 'commissioner@mysurucc.gov.in', phone: '0821-2443800', city: 'Mysuru', state: 'Karnataka', department: 'Municipal Corporation' },
  { name: 'Hubli-Dharwad Municipal Corporation', email: 'commissioner@hdmc.gov.in', phone: '0836-2233001', city: 'Hubli', state: 'Karnataka', department: 'Municipal Corporation' },
  { name: 'Mangaluru City Corporation', email: 'commissioner@mangalurucc.gov.in', phone: '0824-2220308', city: 'Mangaluru', state: 'Karnataka', department: 'Municipal Corporation' },
  // --- Tamil Nadu ---
  { name: 'Greater Chennai Corporation', email: 'commissioner@chennaicorporation.gov.in', phone: '044-25619200', city: 'Chennai', state: 'Tamil Nadu', department: 'Municipal Corporation' },
  { name: 'Coimbatore City Municipal Corporation', email: 'commissioner@ccmc.gov.in', phone: '0422-2390261', city: 'Coimbatore', state: 'Tamil Nadu', department: 'Municipal Corporation' },
  { name: 'Madurai City Municipal Corporation', email: 'commissioner@maduraicorporation.in', phone: '0452-2531235', city: 'Madurai', state: 'Tamil Nadu', department: 'Municipal Corporation' },
  { name: 'Tiruchirappalli City Corporation', email: 'commissioner@trichycorporation.gov.in', phone: '0431-2414100', city: 'Tiruchirappalli', state: 'Tamil Nadu', department: 'Municipal Corporation' },
  { name: 'Salem City Municipal Corporation', email: 'commissioner@salemcorporation.in', phone: '0427-2211001', city: 'Salem', state: 'Tamil Nadu', department: 'Municipal Corporation' },
  // --- Uttar Pradesh ---
  { name: 'Lucknow Nagar Nigam', email: 'nagarnigam@lucknow.nic.in', phone: '0522-2209090', city: 'Lucknow', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Kanpur Nagar Nigam', email: 'nagarnigam@kanpur.nic.in', phone: '0512-2540444', city: 'Kanpur', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Varanasi Nagar Nigam', email: 'nagarnigam@varanasi.nic.in', phone: '0542-2501200', city: 'Varanasi', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Agra Nagar Nigam', email: 'nagarnigam@agra.nic.in', phone: '0562-2463774', city: 'Agra', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Prayagraj Nagar Nigam', email: 'nagarnigam@prayagraj.nic.in', phone: '0532-2401234', city: 'Prayagraj', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Noida Authority', email: 'ceo@noidaauthorityonline.in', phone: '0120-2522216', city: 'Noida', state: 'Uttar Pradesh', department: 'Development Authority' },
  { name: 'Ghaziabad Nagar Nigam', email: 'nagarnigam@ghaziabad.nic.in', phone: '0120-2700100', city: 'Ghaziabad', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  { name: 'Meerut Nagar Nigam', email: 'nagarnigam@meerut.nic.in', phone: '0121-2660222', city: 'Meerut', state: 'Uttar Pradesh', department: 'Municipal Corporation' },
  // --- West Bengal ---
  { name: 'Kolkata Municipal Corporation', email: 'commissioner@kmcgov.in', phone: '033-22861000', city: 'Kolkata', state: 'West Bengal', department: 'Municipal Corporation' },
  { name: 'Howrah Municipal Corporation', email: 'commissioner@howrahmc.org', phone: '033-26383000', city: 'Howrah', state: 'West Bengal', department: 'Municipal Corporation' },
  // --- Rajasthan ---
  { name: 'Jaipur Municipal Corporation', email: 'commissioner@jaipurmc.org', phone: '0141-2619400', city: 'Jaipur', state: 'Rajasthan', department: 'Municipal Corporation' },
  { name: 'Jodhpur Nagar Nigam', email: 'commissioner@jodhpurmc.org', phone: '0291-2650222', city: 'Jodhpur', state: 'Rajasthan', department: 'Municipal Corporation' },
  { name: 'Udaipur Nagar Nigam', email: 'commissioner@udaipurmc.org', phone: '0294-2410590', city: 'Udaipur', state: 'Rajasthan', department: 'Municipal Corporation' },
  { name: 'Kota Nagar Nigam', email: 'commissioner@kotamc.org', phone: '0744-2500261', city: 'Kota', state: 'Rajasthan', department: 'Municipal Corporation' },
  // --- Gujarat ---
  { name: 'Ahmedabad Municipal Corporation', email: 'commissioner@ahmedabadcity.gov.in', phone: '079-25391811', city: 'Ahmedabad', state: 'Gujarat', department: 'Municipal Corporation' },
  { name: 'Surat Municipal Corporation', email: 'commissioner@suratmunicipal.gov.in', phone: '0261-2422244', city: 'Surat', state: 'Gujarat', department: 'Municipal Corporation' },
  { name: 'Vadodara Municipal Corporation', email: 'commissioner@vmc.gov.in', phone: '0265-2431811', city: 'Vadodara', state: 'Gujarat', department: 'Municipal Corporation' },
  { name: 'Rajkot Municipal Corporation', email: 'commissioner@rmc.gov.in', phone: '0281-2448573', city: 'Rajkot', state: 'Gujarat', department: 'Municipal Corporation' },
  { name: 'Gandhinagar Municipal Corporation', email: 'commissioner@gnmc.gov.in', phone: '079-23222222', city: 'Gandhinagar', state: 'Gujarat', department: 'Municipal Corporation' },
  // --- Telangana ---
  { name: 'GHMC Hyderabad', email: 'commissioner@ghmc.gov.in', phone: '040-21112222', city: 'Hyderabad', state: 'Telangana', department: 'Municipal Corporation' },
  { name: 'Warangal Municipal Corporation', email: 'commissioner@warangalmc.gov.in', phone: '0870-2500700', city: 'Warangal', state: 'Telangana', department: 'Municipal Corporation' },
  // --- Andhra Pradesh ---
  { name: 'GVMC Visakhapatnam', email: 'commissioner@gvmc.gov.in', phone: '0891-2746100', city: 'Visakhapatnam', state: 'Andhra Pradesh', department: 'Municipal Corporation' },
  { name: 'Vijayawada Municipal Corporation', email: 'commissioner@vmcvijayawada.gov.in', phone: '0866-2573006', city: 'Vijayawada', state: 'Andhra Pradesh', department: 'Municipal Corporation' },
  { name: 'Tirupati Municipal Corporation', email: 'commissioner@tirupatimc.gov.in', phone: '0877-2233444', city: 'Tirupati', state: 'Andhra Pradesh', department: 'Municipal Corporation' },
  // --- Kerala ---
  { name: 'Thiruvananthapuram Corporation', email: 'secretary@tikimc.in', phone: '0471-2320578', city: 'Thiruvananthapuram', state: 'Kerala', department: 'Municipal Corporation' },
  { name: 'Kochi Municipal Corporation', email: 'secretary@kochicorporation.in', phone: '0484-2351230', city: 'Kochi', state: 'Kerala', department: 'Municipal Corporation' },
  { name: 'Kozhikode Corporation', email: 'secretary@kozhikodecorporation.in', phone: '0495-2366100', city: 'Kozhikode', state: 'Kerala', department: 'Municipal Corporation' },
  // --- Punjab ---
  { name: 'Ludhiana Municipal Corporation', email: 'commissioner@mcludhiana.gov.in', phone: '0161-2741155', city: 'Ludhiana', state: 'Punjab', department: 'Municipal Corporation' },
  { name: 'Amritsar Municipal Corporation', email: 'commissioner@mcamritsar.gov.in', phone: '0183-2501590', city: 'Amritsar', state: 'Punjab', department: 'Municipal Corporation' },
  { name: 'Chandigarh Municipal Corporation', email: 'commissioner@mcchandigarh.gov.in', phone: '0172-2740034', city: 'Chandigarh', state: 'Chandigarh', department: 'Municipal Corporation' },
  // --- Haryana ---
  { name: 'Gurugram Municipal Corporation', email: 'commissioner@mcg.gov.in', phone: '0124-2322005', city: 'Gurugram', state: 'Haryana', department: 'Municipal Corporation' },
  { name: 'Faridabad Municipal Corporation', email: 'commissioner@mcfbd.gov.in', phone: '0129-2241414', city: 'Faridabad', state: 'Haryana', department: 'Municipal Corporation' },
  // --- Bihar ---
  { name: 'Patna Municipal Corporation', email: 'commissioner@pmc.bihar.gov.in', phone: '0612-2219044', city: 'Patna', state: 'Bihar', department: 'Municipal Corporation' },
  // --- Odisha ---
  { name: 'Bhubaneswar Municipal Corporation', email: 'commissioner@bmc.gov.in', phone: '0674-2432205', city: 'Bhubaneswar', state: 'Odisha', department: 'Municipal Corporation' },
  // --- Jharkhand ---
  { name: 'Ranchi Municipal Corporation', email: 'commissioner@rmc.jharkhand.gov.in', phone: '0651-2331001', city: 'Ranchi', state: 'Jharkhand', department: 'Municipal Corporation' },
  // --- Chhattisgarh ---
  { name: 'Raipur Municipal Corporation', email: 'commissioner@raipurmc.gov.in', phone: '0771-4066400', city: 'Raipur', state: 'Chhattisgarh', department: 'Municipal Corporation' },
  // --- Assam ---
  { name: 'Guwahati Municipal Corporation', email: 'commissioner@gmcassam.gov.in', phone: '0361-2731234', city: 'Guwahati', state: 'Assam', department: 'Municipal Corporation' },
  // --- Uttarakhand ---
  { name: 'Dehradun Nagar Nigam', email: 'commissioner@dehradunmc.gov.in', phone: '0135-2713555', city: 'Dehradun', state: 'Uttarakhand', department: 'Municipal Corporation' },
  // --- Goa ---
  { name: 'Corporation of City of Panaji', email: 'commissioner@ccpgoa.gov.in', phone: '0832-2224044', city: 'Panaji', state: 'Goa', department: 'Municipal Corporation' },
  // --- Jammu & Kashmir ---
  { name: 'Srinagar Municipal Corporation', email: 'commissioner@smcjk.gov.in', phone: '0194-2477187', city: 'Srinagar', state: 'Jammu & Kashmir', department: 'Municipal Corporation' },
  { name: 'Jammu Municipal Corporation', email: 'commissioner@jmcjk.gov.in', phone: '0191-2520332', city: 'Jammu', state: 'Jammu & Kashmir', department: 'Municipal Corporation' },
  // --- Himachal Pradesh ---
  { name: 'Shimla Municipal Corporation', email: 'commissioner@shimlamc.gov.in', phone: '0177-2812055', city: 'Shimla', state: 'Himachal Pradesh', department: 'Municipal Corporation' },
  // --- Northeast ---
  { name: 'Imphal Municipal Corporation', email: 'commissioner@imcmanipur.gov.in', phone: '0385-2450001', city: 'Imphal', state: 'Manipur', department: 'Municipal Corporation' },
  { name: 'Shillong Municipal Board', email: 'secretary@shillongmb.gov.in', phone: '0364-2224115', city: 'Shillong', state: 'Meghalaya', department: 'Municipal Board' },
  { name: 'Agartala Municipal Corporation', email: 'commissioner@amctripura.gov.in', phone: '0381-2325001', city: 'Agartala', state: 'Tripura', department: 'Municipal Corporation' },
  { name: 'Aizawl Municipal Corporation', email: 'commissioner@amcmizoram.gov.in', phone: '0389-2334455', city: 'Aizawl', state: 'Mizoram', department: 'Municipal Corporation' },
  { name: 'Itanagar Municipal Council', email: 'secretary@imcap.gov.in', phone: '0360-2212001', city: 'Itanagar', state: 'Arunachal Pradesh', department: 'Municipal Council' },
  { name: 'Kohima Municipal Council', email: 'secretary@kmcnagaland.gov.in', phone: '0370-2260001', city: 'Kohima', state: 'Nagaland', department: 'Municipal Council' },
  { name: 'Gangtok Municipal Corporation', email: 'commissioner@gmcsikkim.gov.in', phone: '03592-202001', city: 'Gangtok', state: 'Sikkim', department: 'Municipal Corporation' },

  // === STATE-LEVEL FALLBACKS (catch-all for unlisted cities) ===
  { name: 'MP Urban Development Dept', email: 'urbandev@mp.gov.in', phone: '0755-2551800', city: '_STATE_FALLBACK_', state: 'Madhya Pradesh', department: 'State Urban Development' },
  { name: 'Maharashtra Urban Development Dept', email: 'urbandev@maharashtra.gov.in', phone: '022-22025471', city: '_STATE_FALLBACK_', state: 'Maharashtra', department: 'State Urban Development' },
  { name: 'UP Urban Development Dept', email: 'urbandev@up.gov.in', phone: '0522-2238855', city: '_STATE_FALLBACK_', state: 'Uttar Pradesh', department: 'State Urban Development' },
  { name: 'Rajasthan Urban Development Dept', email: 'urbandev@rajasthan.gov.in', phone: '0141-2227878', city: '_STATE_FALLBACK_', state: 'Rajasthan', department: 'State Urban Development' },
  { name: 'Gujarat Urban Development Dept', email: 'urbandev@gujarat.gov.in', phone: '079-23250505', city: '_STATE_FALLBACK_', state: 'Gujarat', department: 'State Urban Development' },
  { name: 'Karnataka Urban Development Dept', email: 'urbandev@karnataka.gov.in', phone: '080-22353901', city: '_STATE_FALLBACK_', state: 'Karnataka', department: 'State Urban Development' },
  { name: 'Tamil Nadu Urban Development Dept', email: 'urbandev@tn.gov.in', phone: '044-25672567', city: '_STATE_FALLBACK_', state: 'Tamil Nadu', department: 'State Urban Development' },
  { name: 'Telangana Urban Development Dept', email: 'urbandev@telangana.gov.in', phone: '040-23452222', city: '_STATE_FALLBACK_', state: 'Telangana', department: 'State Urban Development' },
  { name: 'AP Urban Development Dept', email: 'urbandev@ap.gov.in', phone: '0863-2444555', city: '_STATE_FALLBACK_', state: 'Andhra Pradesh', department: 'State Urban Development' },
  { name: 'Kerala Urban Development Dept', email: 'urbandev@kerala.gov.in', phone: '0471-2518800', city: '_STATE_FALLBACK_', state: 'Kerala', department: 'State Urban Development' },
  { name: 'West Bengal Urban Development Dept', email: 'urbandev@wb.gov.in', phone: '033-22145500', city: '_STATE_FALLBACK_', state: 'West Bengal', department: 'State Urban Development' },
  { name: 'Bihar Urban Development Dept', email: 'urbandev@bihar.gov.in', phone: '0612-2233344', city: '_STATE_FALLBACK_', state: 'Bihar', department: 'State Urban Development' },
  { name: 'Punjab Urban Development Dept', email: 'urbandev@punjab.gov.in', phone: '0172-2742222', city: '_STATE_FALLBACK_', state: 'Punjab', department: 'State Urban Development' },
  { name: 'Haryana Urban Development Dept', email: 'urbandev@haryana.gov.in', phone: '0172-2560555', city: '_STATE_FALLBACK_', state: 'Haryana', department: 'State Urban Development' },
  { name: 'Odisha Urban Development Dept', email: 'urbandev@odisha.gov.in', phone: '0674-2536400', city: '_STATE_FALLBACK_', state: 'Odisha', department: 'State Urban Development' },
  { name: 'Jharkhand Urban Development Dept', email: 'urbandev@jharkhand.gov.in', phone: '0651-2400100', city: '_STATE_FALLBACK_', state: 'Jharkhand', department: 'State Urban Development' },
  { name: 'Chhattisgarh Urban Development Dept', email: 'urbandev@cg.gov.in', phone: '0771-2221100', city: '_STATE_FALLBACK_', state: 'Chhattisgarh', department: 'State Urban Development' },
  { name: 'Assam Urban Development Dept', email: 'urbandev@assam.gov.in', phone: '0361-2237100', city: '_STATE_FALLBACK_', state: 'Assam', department: 'State Urban Development' },
  { name: 'Uttarakhand Urban Development Dept', email: 'urbandev@uk.gov.in', phone: '0135-2712800', city: '_STATE_FALLBACK_', state: 'Uttarakhand', department: 'State Urban Development' },
  { name: 'Delhi Urban Development Dept', email: 'urbandev@delhi.gov.in', phone: '011-23392100', city: '_STATE_FALLBACK_', state: 'Delhi', department: 'State Urban Development' },
  { name: 'Goa Urban Development Dept', email: 'urbandev@goa.gov.in', phone: '0832-2419500', city: '_STATE_FALLBACK_', state: 'Goa', department: 'State Urban Development' },
];

async function main() {
  console.log('🌱 Seeding authorities...\n');

  let count = 0;
  for (const auth of authorities) {
    await prisma.authority.upsert({
      where: { id: auth.email }, // Use email as unique check
      update: auth,
      create: auth,
    });
    count++;
    const label = auth.city === '_STATE_FALLBACK_' ? `${auth.state} (state fallback)` : auth.city;
    console.log(`  ✅ ${auth.name} — ${label}`);
  }

  console.log(`\n🎉 Seeded ${count} authorities across India.`);
  console.log(`   • ${authorities.filter(a => a.city !== '_STATE_FALLBACK_').length} city-level`);
  console.log(`   • ${authorities.filter(a => a.city === '_STATE_FALLBACK_').length} state-level fallbacks`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
