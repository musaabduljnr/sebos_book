import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:sebos_book/core/theme/app_theme.dart';
import 'package:sebos_book/features/transactions/data/repositories/transaction_repository.dart';
import 'package:sebos_book/features/transactions/domain/entities/transaction_entity.dart';

class TransactionFormPage extends StatefulWidget {
  const TransactionFormPage({super.key});

  @override
  State<TransactionFormPage> createState() => _TransactionFormPageState();
}

class _TransactionFormPageState extends State<TransactionFormPage> {
  final _txRepo = TransactionRepository();
  int _currentStep = 0;

  // Form State
  String _type = 'sale';
  String _brand = 'Apple';
  final _modelController = TextEditingController();
  final _imeiController = TextEditingController();
  String _condition = 'Used';
  final _costController = TextEditingController();
  final _saleController = TextEditingController();
  final _customerNameController = TextEditingController();
  final _customerPhoneController = TextEditingController();
  final _customerAddressController = TextEditingController();

  final List<String> _brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Tecno', 'Infinix', 'itel', 'Oppo', 'Redmi', 'Other'];
  final List<String> _conditions = ['New', 'Used'];

  void _submit() async {
    final tx = TransactionEntity()
      ..type = _type
      ..brand = _brand
      ..phoneModel = _modelController.text
      ..imei = _imeiController.text
      ..condition = _condition
      ..costPrice = double.tryParse(_costController.text) ?? 0
      ..salePrice = _type == 'sale' ? (double.tryParse(_saleController.text) ?? 0) : 0
      ..date = DateTime.now()
      ..createdAt = DateTime.now()
      ..customerName = _customerNameController.text
      ..customerPhone = _customerPhoneController.text
      ..customerAddress = _customerAddressController.text;

    await _txRepo.addTransaction(tx);
    if (mounted) {
       ScaffoldMessenger.of(context).showSnackBar(
         SnackBar(
           content: const Text('Transaction recorded successfully!'),
           backgroundColor: AppTheme.success,
           behavior: SnackBarBehavior.floating,
         )
       );
       // Reset form or navigate
       setState(() {
         _currentStep = 0;
         _modelController.clear();
         _imeiController.clear();
         _costController.clear();
         _saleController.clear();
         _customerNameController.clear();
         _customerPhoneController.clear();
         _customerAddressController.clear();
       });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Transaction'),
        backgroundColor: Colors.transparent,
      ),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: _currentStep,
        elevation: 0,
        connectorColor: const MaterialStatePropertyAll(Colors.white10),
        onStepContinue: () {
          if (_currentStep == 2) {
             // Validate mandatory phone on Step 2 (Pricing + Customer Info)
             if (_customerPhoneController.text.isEmpty) {
               ScaffoldMessenger.of(context).showSnackBar(
                 const SnackBar(content: Text('Customer Phone Number is mandatory'), backgroundColor: AppTheme.error)
               );
               return;
             }
          }
          if (_currentStep < 3) {
            setState(() => _currentStep++);
          } else {
            _submit();
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() => _currentStep--);
          }
        },
        steps: [
          _buildTypeStep(),
          _buildDetailsStep(),
          _buildPriceStep(),
          _buildReviewStep(),
        ],
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.only(top: 32),
            child: Row(
              children: [
                if (_currentStep > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: details.onStepCancel,
                      child: const Text('BACK'),
                    ),
                  ),
                if (_currentStep > 0) const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: details.onStepContinue,
                    child: Text(_currentStep == 3 ? 'CONFIRM' : 'NEXT'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Step _buildTypeStep() {
    return Step(
      title: const Text(''),
      isActive: _currentStep >= 0,
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Transaction Type', style: AppTheme.darkTheme.textTheme.titleLarge),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildTypeCard('sale', LucideIcons.shoppingCart, 'Sale'),
              const SizedBox(width: 16),
              _buildTypeCard('trade-in', LucideIcons.refreshCcw, 'Trade-In'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTypeCard(String type, IconData icon, String label) {
    final isSelected = _type == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _type = type),
        child: Container(
          height: 100,
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.accentBlue.withOpacity(0.1) : AppTheme.cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? AppTheme.accentBlue : Colors.white10,
              width: 1.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: isSelected ? AppTheme.accentBlue : AppTheme.textMuted, size: 28),
              const SizedBox(height: 8),
              Text(label, style: TextStyle(color: isSelected ? AppTheme.accentBlue : AppTheme.textSecondary, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Step _buildDetailsStep() {
    return Step(
      title: const Text(''),
      isActive: _currentStep >= 1,
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Phone Details', style: AppTheme.darkTheme.textTheme.titleLarge),
          const SizedBox(height: 20),
          DropdownButtonFormField<String>(
            value: _brand,
            items: _brands.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
            onChanged: (v) => setState(() => _brand = v!),
            decoration: const InputDecoration(labelText: 'Brand'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _modelController,
            decoration: const InputDecoration(labelText: 'Model Name', hintText: 'e.g. iPhone 15 Pro'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _imeiController,
            maxLength: 15,
            decoration: const InputDecoration(labelText: 'IMEI Number', hintText: '15 digits'),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 20),
          Text('Condition', style: AppTheme.darkTheme.textTheme.bodySmall),
          const SizedBox(height: 8),
          Row(
            children: _conditions.map((c) {
              final isSel = _condition == c;
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: ChoiceChip(
                  label: Text(c),
                  selected: isSel,
                  onSelected: (s) => setState(() => _condition = c),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Step _buildPriceStep() {
    return Step(
      title: const Text(''),
      isActive: _currentStep >= 2,
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(_type == 'sale' ? 'Pricing' : 'Trade-In Value', style: AppTheme.darkTheme.textTheme.titleLarge),
          const SizedBox(height: 20),
          TextField(
            controller: _costController,
            decoration: InputDecoration(
              labelText: _type == 'sale' ? 'Cost Price' : 'Amount Paid',
              prefixText: '₦ ',
            ),
            keyboardType: TextInputType.number,
          ),
          if (_type == 'sale') ...[
            const SizedBox(height: 16),
            TextField(
              controller: _saleController,
              decoration: const InputDecoration(
                labelText: 'Sale Price',
                prefixText: '₦ ',
              ),
              keyboardType: TextInputType.number,
            ),
          ],
          const SizedBox(height: 32),
          const Divider(color: Colors.white10),
          const SizedBox(height: 16),
          Text('Customer Information', style: AppTheme.darkTheme.textTheme.titleMedium?.copyWith(color: AppTheme.accentBlue)),
          const SizedBox(height: 16),
          TextField(
            controller: _customerNameController,
            decoration: const InputDecoration(labelText: 'Customer Name', hintText: 'Full Name'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _customerPhoneController,
            decoration: const InputDecoration(labelText: 'Phone Number *', hintText: 'e.g. 08012345678'),
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _customerAddressController,
            decoration: const InputDecoration(labelText: 'Address', hintText: 'Physical address'),
            maxLines: 2,
          ),
        ],
      ),
    );
  }

  Step _buildReviewStep() {
    final currencyFormat = NumberFormat.currency(symbol: '₦', decimalDigits: 0);
    return Step(
      title: const Text(''),
      isActive: _currentStep >= 3,
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Review Details', style: AppTheme.darkTheme.textTheme.titleLarge),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.cardBg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                _buildReviewRow('Type', _type.toUpperCase()),
                _buildReviewRow('Device', '$_brand ${_modelController.text}'),
                _buildReviewRow('IMEI', _imeiController.text),
                _buildReviewRow('Condition', _condition),
                _buildReviewRow('Cost', currencyFormat.format(double.tryParse(_costController.text) ?? 0)),
                if (_type == 'sale')
                  _buildReviewRow('Sale Price', currencyFormat.format(double.tryParse(_saleController.text) ?? 0)),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(color: Colors.white10),
                ),
                _buildReviewRow('Customer', _customerNameController.text.isEmpty ? 'N/A' : _customerNameController.text),
                _buildReviewRow('Phone', _customerPhoneController.text),
                _buildReviewRow('Address', _customerAddressController.text.isEmpty ? 'N/A' : _customerAddressController.text),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTheme.darkTheme.textTheme.bodySmall),
          Text(value, style: AppTheme.darkTheme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
